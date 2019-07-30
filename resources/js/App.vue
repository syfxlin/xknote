<template>
  <main id="app-main">
    <router-view
      :xknoteTab.sync="xknoteTab"
      :currListSource.sync="currListSource"
      :currList.sync="currList"
      :cloudList.sync="cloudList"
      :localList.sync="localList"
      :xknoteOpened.sync="xknoteOpened"
      :xknoteOpenedIndex.sync="xknoteOpenedIndex"
      :noteBaseInfo.sync="noteBaseInfo"
      :loadRememberNote="loadRememberNote"
      :listOperate="listOperate"
      :noteOperate="noteOperate"
      :setXknoteOpened="setXknoteOpened"
      :switchTab="switchTab"
      :openNote="openNote"
      :readOpened.sync="readOpened"
      ref="children"
    ></router-view>
  </main>
</template>

<script>
import "./assets/style.css";
export default {
  name: "App",
  created() {
    window.nThis.app = this;
    window.xknoteOpenedChangeFlag = true;
  },
  data() {
    return {
      // 存储当前开启的文档信息（开启于Editor中）
      noteBaseInfo: {
        type: "note",
        path: "",
        name: "",
        status: "N",
        note: {
          title: "",
          author: "",
          content: "暂未打开任何文件，请选择文件。",
          created_at: "",
          updated_at: ""
        }
      },
      xknoteOpened: {
        type: "note",
        path: "",
        name: "",
        status: "N",
        note: {
          title: "",
          author: "",
          content: "暂未打开任何文件，请选择文件。",
          created_at: "",
          updated_at: ""
        }
      },
      // 存储当前开启的文档的位置，当前位置和源位置
      // curr存储的是位于currList的索引
      // source存储的分别是源的位置 本地or云端（data-storage） 在其列表中的index（data-index）
      xknoteOpenedIndex: {
        curr: "",
        source: {
          index: "",
          storage: ""
        }
      },
      // currList的扩展信息
      currListSource: [],
      currList: [],
      cloudList: [],
      localList: [],
      xknoteTab: "cloud",
      readOpened: {
        type: "note",
        path: "",
        name: "",
        status: "N",
        note: {
          title: "",
          author: "",
          content: "暂未打开任何文件，请选择文件。",
          created_at: "",
          updated_at: ""
        }
      }
    };
  },
  mounted() {
    this.loadLocalNotes();
    this.loadCloudFolders();
    window.xknote = {};
  },
  methods: {
    /**
     * 切换Tab
     * @param {string} tabName 要切换到的Tab名称
     * @returns void
     */
    switchTab(tabName) {
      this.xknoteTab = tabName;
    },
    /**
     * 读取云端的文件夹及笔记
     * @param void
     * @returns void
     */
    loadCloudFolders() {
      window.axios
        .get("/api/folders")
        .then(res => {
          this.cloudList = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    /**
     * 读取本地的笔记
     * @param void
     * @returns void
     */
    loadLocalNotes() {
      this.noteLocalDB("readAll", "", (e, list) => {
        this.localList = list;
      });
    },
    /**
     * 读取之前开启的笔记
     * @param void
     * @returns void
     */
    loadRememberNote() {
      this.optionsDB("read", "rememberNote", (e, data) => {
        if (data) {
          this.localList.forEach((item, index) => {
            if (item.path === data.path) {
              this.openNote(item, {
                index: index + "",
                storage: "local"
              });
            }
          });
          // TODO: 从服务器读取Note信息，通过path读取
        }
        this.timedTask("saveCurrOpenedNote");
      });
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
            this.optionsDB("put", {
              name: "rememberNote",
              path: this.xknoteOpened.path
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
      this.xknoteOpened = noteInfo;
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
     *   @param {string} source.index 笔记来源的索引
     *   @param {string} source.storage 笔记来源的存储位置（local，cloud）
     * @param {string} mode 当前处于的模式
     * @returns void
     */
    openNote(note, source, mode = "normal") {
      if (mode === "normal") {
        this.currList.forEach((item, index) => {
          if (item.path === note.path) {
            source.index = index;
            source.storage = "curr";
          }
        });
        // 加载到xknoteOpened，由于XKEditor不能自动修改数据，所以需要手动设置数据
        this.setXknoteOpened(note);
        window.xknoteOpenedChangeFlag = false;
        // 添加到currList，同时将源数据添加到currListSource
        let currIndex;
        if (source.storage !== "curr") {
          currIndex = this.listOperate("add", "curr", "", {
            note: note,
            source: source
          });
          this.xknoteOpenedIndex.curr = currIndex;
        } else {
          this.xknoteOpenedIndex.curr = parseInt(source.index);
          currIndex = source.index;
        }
        this.xknoteOpenedIndex.source = source;
        this.xknoteTab = "curr";
        this.$nextTick(() => {
          // 添加当前打开的文件的active效果
          let ele;
          ele = document.querySelector(".active[data-storage='curr']");
          if (ele) {
            ele.classList.remove("active");
          }
          document
            .querySelector(
              "[data-storage='curr'][data-index='" + currIndex + "']"
            )
            .classList.add("active");
          window.xknoteOpenedChangeFlag = true;
        });
      }
      if (mode === "read") {
        this.readOpened = JSON.parse(JSON.stringify(note));
      }
    },
    /**
     * 操作本地数据库
     * @param {string} table 本地数据库table的名称
     * @param {string} operate 操作名称
     * @param {object=} data 数据
     * @param {function(e, data)=} callS 成功的回调
     * @param {function(e)=} callE 失败的回调
     * @returns void
     */
    xknoteDB(
      table,
      operate,
      data = null,
      callS = (e, data = null) => {},
      callE = e => {}
    ) {
      var requset = window.indexedDB.open("xknote");
      var db = null;
      var os = null;
      requset.onerror = e => {
        console.error("indexedDB开启失败: " + e);
        callE(e);
      };
      requset.onupgradeneeded = e => {
        db = e.target.result;
        if (!db.objectStoreNames.contains("localList")) {
          console.log("indexedDB中不存在localList表");
          os = db.createObjectStore("localList", {
            keyPath: "path"
          });
        }
        if (!db.objectStoreNames.contains("options")) {
          console.log("indexedDB中不存在options表");
          os = db.createObjectStore("options", {
            keyPath: "name"
          });
        }
      };
      requset.onsuccess = () => {
        db = requset.result;
        os = db.transaction([table], "readwrite").objectStore(table);
        if (operate === "add") {
          let req = os.add(data);
          req.onsuccess = e => {
            callS(e);
          };
          req.onerror = e => {
            console.log("数据写入失败: " + e);
            callE(e);
          };
        }
        if (operate === "addAll") {
          for (let i = 0; i < data.length; i++) {
            let req = os.add(data[i]);
            req.onsuccess = e => {
              callS(e);
            };
            req.onerror = e => {
              console.log("数据写入失败: " + e);
              callE(e);
            };
          }
        }
        if (operate === "read") {
          let reData = null;
          let req = os.get(data);
          req.onsuccess = e => {
            reData = req.result;
            callS(e, reData);
          };
          req.onerror = e => {
            console.log("数据读取失败: " + e);
            callE(e);
          };
        }
        if (operate === "readAll") {
          let reData = null;
          let req = os.getAll();
          req.onsuccess = e => {
            reData = req.result;
            callS(e, reData);
          };
          req.onerror = e => {
            console.log("数据读取失败: " + e);
            callE(e);
          };
        }
        if (operate === "delete") {
          let req = os.delete(data);
          req.onsuccess = e => {
            callS(e);
          };
          req.onerror = e => {
            console.error("删除数据失败:" + e);
            callE(e);
          };
        }
        if (operate === "deleteAll") {
          let req = os.clear();
          req.onsuccess = e => {
            callS(e);
          };
          req.onerror = e => {
            console.error("删除数据失败:" + e);
            callE(e);
          };
        }
        if (operate === "put") {
          let req = os.put(data);
          req.onsuccess = e => {
            callS(e);
          };
          req.onerror = e => {
            console.log("数据更新失败: " + e);
            callE(e);
          };
        }
        db.close();
      };
    },
    /**
     * 操作本地笔记数据库
     * @param {string} operate
     * @param {object=} data 数据
     * @param {function(e, data)=} callS 成功的回调
     * @param {function(e)=} callE 失败的回调
     * @returns void
     */
    noteLocalDB(
      operate,
      data = null,
      callS = (e, data = null) => {},
      callE = e => {}
    ) {
      this.xknoteDB("localList", operate, data, callS, callE);
    },
    /**
     * 操作本地选项设置数据库
     * @param {string} operate
     * @param {object=} data 数据
     * @param {function(e, data)=} callS 成功的回调
     * @param {function(e)=} callE 失败的回调
     * @returns void
     */
    optionsDB(
      operate,
      data = null,
      callS = (e, data = null) => {},
      callE = e => {}
    ) {
      this.xknoteDB("options", operate, data, callS, callE);
    },
    /**
     * 操作列表
     * @param {string} operate 操作名称
     * @param {string} storage 要操作对象存储的位置
     * @param {string=} index 要操作对象的索引
     * @param {object=} noteInfo 笔记信息，正常情况下结构同this.noteBaseInfo
     *   @param {object=} noteInfo.note （add curr）笔记信息，结构同this.noteBaseInfo
     *   @param {object=} noteInfo.source （add curr）笔记来源
     * @returns {object | number} 笔记信息（get,delete）或者当前笔记的索引（add）
     */
    listOperate(operate, storage, index = "", noteInfo = null) {
      let arr = [];
      let list;
      if (typeof index !== "string") {
        index = index + "";
      }
      arr = index.split(":");
      list = this[storage + "List"];
      for (let i = 0; i < arr.length - 1; i++) {
        if (i === 0) {
          list = list[arr[i]].sub;
        } else {
          list = list.sub[arr[i]];
        }
      }
      if (operate === "delete") {
        let noteList = list.splice(arr[arr.length - 1], 1);
        if (storage === "curr") {
          this.currListSource.splice(arr[arr.length - 1], 1);
        }
        return noteList[0];
      }
      if (operate === "add") {
        if (storage === "curr") {
          let currIndex = this.currList.push(noteInfo.note) - 1;
          this.currListSource.push(noteInfo.source);
          return currIndex;
        }
        if (storage === "local") {
          return this[storage + "List"].push(noteInfo) - 1;
        }
      }
      if (operate === "get") {
        return list[arr[arr.length - 1]];
      }
    },
    /**
     * 操作笔记
     * @param {string} operate 操作名称
     * @param {string} storage 要操作对象存储的位置
     * @param {object=} noteInfo 笔记信息，正常情况下结构同this.noteBaseInfo
     *   @param {object=} noteInfo.oldNote (rename) 旧的笔记信息
     *   @param {object=} noteInfo.note (rename) 新的笔记信息
     * @returns void
     */
    noteOperate(operate, storage, noteInfo = null, callback = () => {}) {
      if (operate === "read") {
        if (storage === "local") {
          this.noteLocalDB("read", noteInfo.path, (e, data) => {
            callback(data);
          });
        }
      }
      if (operate === "delete") {
        if (storage === "local") {
          this.noteLocalDB("delete", noteInfo.path);
        }
        // TODO: 云端删除
      }
      if (operate === "save") {
        if (storage === "local") {
          this.noteLocalDB("delete", noteInfo.path);
          this.noteLocalDB("add", noteInfo);
        }
        if (storage === "cloud") {
          // TODO: 云端保存
        }
      }
      if (operate === "rename") {
        if (storage === "local") {
          this.noteLocalDB("delete", noteInfo.oldNote.path);
          this.noteLocalDB("add", noteInfo.note);
        }
        if (storage === "cloud") {
          // TODO: 云端重命名
        }
        // TODO: 重命名成功后提示
      }
    },
    /**
     * 监听当前打开的笔记改变事件触发的函数
     * @param void
     * @returns void
     */
    watchNote() {
      if (!window.xknoteOpenedChangeFlag) return;
      this.xknoteOpened.status = "N";
      var d = new Date();
      this.xknoteOpened.note.updated_at =
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
        d.getSeconds();
    }
  },
  watch: {
    "xknoteOpened.note.content": "watchNote",
    "xknoteOpened.note.title": "watchNote",
    $route(to) {
      if (to.name === "Read") {
        this.readOpened = JSON.parse(JSON.stringify(this.xknoteOpened));
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
