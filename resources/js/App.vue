<template>
  <main id="app-main">
    <transition name="fade" mode="out-in">
      <router-view
        :loadFirstNote="loadFirstNote"
        :setXknoteOpened="setXknoteOpened"
        :openNote="openNote"
        :timeToast="timeToast"
        :configOperate="configOperate"
        :listOperate="listOperate"
        ref="children"
      ></router-view>
    </transition>
    <div :class="'toast toast-' + toast.status">
      <button class="btn btn-clear float-right"></button>
      <p>{{ toast.message }}</p>
    </div>
  </main>
</template>

<script>
import "./assets/style.css";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "App",
  created() {
    // 当打开note中的时候防止更改
    window.xknoteOpenedChangeFlag = true;
    // 是否是通过输入URL引发的query变动
    window.inputQueryChangeFlag = true;
  },
  data() {
    return {
      prevRouter: null
    };
  },
  mounted() {
    this.loadLocalNotes();
    // this.loadCloudFolders();
    window.xknote = {};
  },
  computed: {
    ...mapState("note", [
      "noteBaseInfo",
      "xknoteOpened",
      "xknoteOpenedIndex",
      "currListSource",
      "currList",
      "cloudList",
      "localList",
      "xknoteTab",
      "readOpened"
    ]),
    ...mapState({
      toast: state => state.toast
    }),
    ...mapGetters("note", ["getReData"])
  },
  methods: {
    ...mapActions("note", [
      "switchTab",
      "folderOperate",
      "noteOperate",
      "loadCloudFolders",
      "loadLocalNotes",
      "setXknoteOpenedA",
      "setReadOpenedA",
      "setXknoteOpenedIndexA"
    ]),
    ...mapActions("toast", ["timeToast"]),
    ...mapActions("db", ["optionsDB"]),
    listOperate(data) {
      this.$store.commit("note/LIST_OPERATE", data, { root: true });
      this.$store.commit("note/CHANGE_COUNT");
      return this.getReData;
    },
    // TODO: cloud-tab加载过慢导致info为null
    async loadPathNote(path, mode = "normal") {
      let info = document.querySelector(
        '.local-tab [data-path="' + path + '"]'
      );
      if (!info) {
        info = document.querySelector('.cloud-tab [data-path="' + path + '"]');
      }
      if (!info) {
        return;
      }
      let storage = info.getAttribute("data-storage");
      let item = await this.listOperate({
        operate: "get",
        storage: storage,
        path: path
      });
      this.openNote(
        item,
        {
          path: path,
          storage: storage
        },
        mode
      );
    },
    /**
     * 读取之前开启的笔记
     * @param void
     * @returns void
     */
    loadFirstNote(mode = "normal") {
      // 防止意外加载
      // TODO: 寻求更好的方案
      if (mode === "read" && this.prevRouter) {
        return;
      }
      if (mode !== "read" && this.xknoteOpened.path) {
        return;
      }
      if (this.$route.query.note) {
        this.loadPathNote(this.$route.query.note, mode);
      } else {
        this.optionsDB({ operate: "read", data: "rememberNote" }).then(data => {
          if (data) {
            this.loadPathNote(data.path, mode);
          }
          this.timedTask("saveCurrOpenedNote");
        });
      }
    },
    /**
     * 定时执行任务，包括循环任务
     * @param {string} task 任务名称
     * @returns void
     */
    timedTask(task) {
      if (task === "saveCurrOpenedNote") {
        // 每10秒中将当前打开的笔记信息保存至本地数据库，用以下次开启做准备
        setInterval(() => {
          if (this.xknoteOpened.path !== "" && this.$route.name === "Home") {
            this.optionsDB({
              operate: "put",
              data: {
                name: "rememberNote",
                path: this.xknoteOpened.path
              }
            });
            console.log("remeberNote");
          }
        }, 10000);
      }
    },
    /**
     * 设置当前开启的文档
     * @param {object} noteInfo 笔记信息，结构同this.noteBaseInfo
     * @returns void
     */
    setXknoteOpened(noteInfo) {
      window.xknoteOpenedChangeFlag = false;
      let noteConEle = document.querySelector(
        ".xknote-header > .navbar-center"
      );
      if (noteInfo.path === "") {
        window.XKEditor.ace.setReadOnly(true);
        if (noteConEle) {
          noteConEle.classList.add("disabled");
        }
      } else {
        window.XKEditor.ace.setReadOnly(false);
        if (noteConEle) {
          noteConEle.classList.remove("disabled");
        }
      }
      this.setXknoteOpenedA(noteInfo);
      if (window.eThis && window.XKEditor) {
        if (window.eThis.e.editorMode === "ace") {
          window.XKEditor.setMarkdown(this.xknoteOpened.note.content);
        } else {
          window.XKEditor.switchEditor();
          window.XKEditor.setMarkdown(this.xknoteOpened.note.content);
        }
      }
      window.xknoteOpenedChangeFlag = true;
    },
    /**
     * 打开笔记
     * @param {object} note 笔记信息，结构同this.noteBaseInfo
     * @param {object} source 笔记的来源
     *   @param {string} source.path 笔记来源的索引
     *   @param {string} source.storage 笔记来源的存储位置（local，cloud）
     * @param {string} mode 当前处于的模式
     * @returns void
     */
    openNote(note, source, mode = "normal", isNew = false) {
      let open = () => {
        // 更改query
        window.inputQueryChangeFlag = false;
        if (!this.$route.query.note || this.$route.query.note !== note.path) {
          this.$router.replace({
            query: {
              ...this.$route.query,
              note: note.path
            }
          });
        }
        if (mode === "normal") {
          for (let key in this.currList) {
            if (this.currList[key].path === note.path) {
              source.path = note.path; //TODO: 修改
              source.storage = "curr";
            }
          }
          // 加载到xknoteOpened，由于XKEditor不能自动修改数据，所以需要手动设置数据
          this.setXknoteOpened(note);
          window.xknoteOpenedChangeFlag = false;
          // 添加到currList，同时将源数据添加到currListSource
          let currPath;
          if (source.storage !== "curr") {
            this.listOperate({
              operate: "add",
              storage: "curr",
              path: note.path,
              noteInfo: {
                note: note,
                source: source
              }
            });
            currPath = note.path;
          } else {
            currPath = source.path;
          }
          this.setXknoteOpenedIndexA({
            curr: currPath,
            source: source
          });
          this.switchTab("curr");
          this.$nextTick(() => {
            // 添加当前打开的文件的active效果
            let ele;
            ele = document.querySelector(".active[data-storage='curr']");
            if (ele) {
              ele.classList.remove("active");
            }
            document
              .querySelector(
                "[data-storage='curr'][data-path='" + note.path + "']"
              )
              .classList.add("active");
            window.xknoteOpenedChangeFlag = true;
          });
        }
        if (mode === "read") {
          this.setReadOpenedA(JSON.parse(JSON.stringify(note)));
        }
      };
      if (!isNew && source.storage === "cloud") {
        let noteEle = document.querySelector(
          '[data-path="' + note.path + '"][data-storage="cloud"]'
        );
        let icon = noteEle.querySelector(".tile-action");
        icon.style.display = "unset";
        let btn = icon.querySelector(".btn");
        if (mode === "normal") {
          btn.querySelector(".icon").style.display = "none";
        }
        btn.querySelector(".loading").style.display = "block";
        this.noteOperate({
          operate: "read",
          storage: "cloud",
          noteInfo: note
        }).then(data => {
          // note.note = data.note;
          this.$set(note, "note", data.note);
          note.status = "C";
          icon.style.display = "";
          if (mode === "normal") {
            btn.querySelector(".icon").style.display = "unset";
          }
          btn.querySelector(".loading").style.display = "none";
          open();
        });
      } else {
        open();
      }
    },
    configOperate(operate, config = null, callS = () => {}, callE = () => {}) {
      if (operate === "getGitConfig") {
        window.axios
          .get("/api/repo/git")
          .then(res => {
            callS(res.data.config);
          })
          .catch(err => {
            console.error(err);
            callE(err);
          });
      }
      if (operate === "setGitConfig") {
        window.axios
          .put("/api/repo/git", { ...config })
          .then(res => {
            callS(res.data);
          })
          .catch(err => {
            console.log(err);
            callE(err);
          });
      }
    },
    /**
     * 监听当前打开的笔记改变事件触发的函数
     * @param void
     * @returns void
     */
    watchNote() {
      if (!window.xknoteOpenedChangeFlag) return;
      var d = new Date();
      this.setXknoteOpenedA({
        ...this.xknoteOpened,
        status: "N",
        note: {
          ...this.xknoteOpened.note,
          updated_at:
            d.getFullYear() +
            "/" +
            (d.getMonth() + 1) +
            "/" +
            d.getDate() +
            " " +
            d.getHours() +
            ":" +
            d.getMinutes() +
            ":" +
            d.getSeconds()
        }
      });
      if (this.xknoteOpened.path !== "") {
        this.listOperate({
          operate: "set",
          storage: "curr",
          path: this.xknoteOpenedIndex.source.path,
          noteInfo: this.xknoteOpened
        });
      }
    }
  },
  watch: {
    "xknoteOpened.note.content": "watchNote",
    "xknoteOpened.note.title": "watchNote",
    $route(to, from) {
      this.prevRouter = from.name;
      if (window.inputQueryChangeFlag && to.name === "Read") {
        this.setReadOpenedA(JSON.parse(JSON.stringify(this.xknoteOpened)));
      }
      if (window.inputQueryChangeFlag && this.$route.query.note) {
        let mode = "normal";
        if (this.$route.name === "Read") {
          mode = "read";
        }
        this.loadPathNote(this.$route.query.note, mode);
      }
      window.inputQueryChangeFlag = true;
    },
    "toast.show": function(val) {
      let toast = document.querySelector(".toast");
      if (val) {
        toast.style.visibility = "visible";
        toast.style.opacity = "1";
      } else {
        setTimeout(() => {
          toast.style.visibility = "hidden";
        }, 500);
        toast.style.opacity = "0";
      }
    }
  }
};
</script>

<style>
#app-main {
  height: 100%;
}
</style>
