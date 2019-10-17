<template>
  <main id="app-main">
    <transition name="fade" mode="out-in">
      <router-view
        :xknoteTab.sync="xknoteTab"
        :currListSource.sync="currListSource"
        :currList.sync="currList"
        :cloudList.sync="cloudList"
        :localList.sync="localList"
        :xknoteOpened.sync="xknoteOpened"
        :xknoteOpenedIndex.sync="xknoteOpenedIndex"
        :noteBaseInfo.sync="noteBaseInfo"
        :loadFirstNote="loadFirstNote"
        :listOperate="listOperate"
        :noteOperate="noteOperate"
        :folderOperate="folderOperate"
        :setXknoteOpened="setXknoteOpened"
        :switchTab="switchTab"
        :openNote="openNote"
        :readOpened.sync="readOpened"
        :loadCloudFolders="loadCloudFolders"
        ref="children"
      ></router-view>
    </transition>
    <div
      :class="'toast toast-' + toast.status"
      :style="toast.show ? 'visibility: visible;' : 'visibility: hidden;'"
    >
      <button class="btn btn-clear float-right"></button>
      <p>{{ toast.message }}</p>
    </div>
  </main>
</template>

<script>
import "./assets/style.css";
export default {
  name: "App",
  created() {
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
      },
      prevRouter: null,
      toast: {
        show: false,
        message: "",
        status: "",
        toastList: []
      }
    };
  },
  mounted() {
    this.loadLocalNotes();
    this.loadCloudFolders();
    window.xknote = {};
  },
  methods: {
    showToast(message, status) {
      this.toast.message = message;
      this.toast.status = status;
      this.toast.show = true;
      let toast = document.querySelector(".toast");
      toast.style.opacity = "1";
    },
    hideToast(callback = () => {}) {
      let toast = document.querySelector(".toast");
      toast.style.opacity = "0";
      setTimeout(() => {
        this.toast.show = false;
        callback();
      }, 500);
    },
    popToast() {
      let toast = this.toast.toastList[0];
      this.showToast(toast.message, toast.status);
      setTimeout(() => {
        this.hideToast(() => {
          this.toast.toastList.shift();
          if (this.toast.toastList.length !== 0) {
            this.popToast();
          }
        });
      }, toast.delay);
    },
    timeToast(message, status, delay) {
      this.toast.toastList.push({
        message: message,
        status: status,
        delay: delay
      });
      if (this.toast.toastList.length === 1) {
        this.popToast();
      }
    },
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
      this.folderOperate("readAll", null, data => {
        this.cloudList = data.folders;
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
    loadPathNote(path, mode = "normal") {
      let info = document.querySelector(
        '.local-tab [data-path="' + path + '"]'
      );
      if (!info) {
        info = document.querySelector('.cloud-tab [data-path="' + path + '"]');
      }
      let index = info.getAttribute("data-index") + "";
      let storage = info.getAttribute("data-storage");
      let item = this.listOperate("get", storage, index);
      this.openNote(
        item,
        {
          index: index,
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
        this.optionsDB("read", "rememberNote", (e, data) => {
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
      let open = () => {
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
      };
      if (source.storage === "cloud") {
        let noteEle = document.querySelector(
          '[data-index="' + source.index + '"][data-storage="cloud"]'
        );
        let icon = noteEle.querySelector(".tile-action");
        icon.style.display = "unset";
        let btn = icon.querySelector(".btn");
        if (mode === "normal") {
          btn.querySelector(".icon").style.display = "none";
        }
        btn.querySelector(".loading").style.display = "block";
        this.noteOperate("read", "cloud", note, data => {
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
        // if (i === 0) {
        list = list[arr[i]].sub;
        // } else {
        //   list = list.sub[arr[i]];
        // }
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
    noteOperate(
      operate,
      storage,
      noteInfo = null,
      callS = () => {},
      callE = () => {}
    ) {
      if (operate === "read") {
        if (storage === "local") {
          this.noteLocalDB("read", noteInfo.path, (e, data) => {
            callS(data);
          });
        }
        if (storage === "cloud") {
          window.axios
            .get("/api/notes", {
              params: {
                path: noteInfo.path
              }
            })
            .then(res => {
              callS(res.data);
            })
            .catch(err => {
              console.error(err);
              this.timeToast("加载失败！请重试。", "error", 1000);
              callE(err);
            });
        }
      }
      if (operate === "create") {
        if (storage === "cloud") {
          window.axios
            .post("/api/notes", {
              path: noteInfo.path,
              title: noteInfo.note.title,
              author: noteInfo.note.author,
              created_at: noteInfo.note.created_at,
              updated_at: noteInfo.note.updated_at,
              content: noteInfo.note.content
            })
            .then(res => {
              this.timeToast("新建笔记成功！", "success", 1000);
              if (res.data.error == false) {
                callS(res);
              } else {
                callE(res);
              }
            })
            .catch(err => {
              console.error(err);
              this.timeToast("新建笔记失败！请重试。", "error", 1000);
              callE(err);
            });
        }
      }
      if (operate === "delete") {
        if (storage === "local") {
          this.noteLocalDB(
            "delete",
            noteInfo.path,
            (e, data) => {
              callS(data);
            },
            callE
          );
        }
        if (storage === "cloud") {
          window.axios
            .delete("/api/notes", {
              params: {
                path: noteInfo.path
              }
            })
            .then(res => {
              console.log(res);
              this.timeToast("删除成功！", "success", 1000);
              if (res.data.error == false) {
                callS(res);
              } else {
                callE(res);
              }
            })
            .catch(err => {
              console.error(err);
              this.timeToast("删除失败！请重试。", "error", 1000);
              callE(err);
            });
        }
      }
      if (operate === "save") {
        if (storage === "local") {
          this.noteLocalDB(
            "delete",
            noteInfo.path,
            () => {
              this.timeToast("保存到本地成功！", "success", 1000);
              this.noteLocalDB("add", noteInfo, callS, callE);
            },
            callE
          );
        }
        if (storage === "cloud") {
          window.axios
            .put("/api/notes", {
              path: noteInfo.path,
              title: noteInfo.note.title,
              author: noteInfo.note.author,
              created_at: noteInfo.note.created_at,
              updated_at: noteInfo.note.updated_at,
              content: noteInfo.note.content
            })
            .then(res => {
              this.timeToast("保存到云端成功！", "success", 1000);
              if (res.data.error == false) {
                callS(res);
              } else {
                callE(res);
              }
            })
            .catch(err => {
              console.error(err);
              this.timeToast("保存到云端失败！请重试。", "error", 1000);
              callE(err);
            });
        }
      }
      if (operate === "rename") {
        if (storage === "local") {
          this.noteLocalDB("delete", noteInfo.oldNote.path);
          this.noteLocalDB("add", noteInfo.note);
          callS();
        }
        if (storage === "cloud") {
          window.axios
            .put("/api/notes/rename", {
              oldPath: noteInfo.oldNote.path,
              newPath: noteInfo.note.path
            })
            .then(res => {
              console.log(res);
              this.timeToast("重命名成功！", "success", 1000);
              if (res.data.error == false) {
                callS(res);
              } else {
                callE(res);
              }
            })
            .catch(err => {
              console.error(err);
              this.timeToast("重命名失败！请重试。", "error", 1000);
              callE(err);
            });
        }
      }
      if (operate === "exist") {
        if (storage === "cloud") {
          window.axios
            .get("/api/notes/exist", {
              params: { path: noteInfo.path }
            })
            .then(res => {
              callS(res.data);
            })
            .catch(err => {
              console.error(err);
              callE(err);
            });
        }
        if (storage === "local") {
          let flag = false;
          for (let i = 0; i < this.localList.length; i++) {
            if (this.localList[i].path === noteInfo.path) {
              flag = true;
            }
          }
          callS({ exist: flag });
        }
      }
    },
    folderOperate(
      operate,
      folderInfo = null,
      callS = () => {},
      callE = () => {}
    ) {
      if (operate === "readAll") {
        window.axios
          .get("/api/folders")
          .then(res => {
            callS(res.data);
          })
          .catch(err => {
            console.error(err);
            callE(err);
          });
      }
      if (operate === "readFlat") {
        window.axios
          .get("/api/folders/flat")
          .then(res => {
            callS(res.data);
          })
          .catch(err => {
            console.error(err);
            callE(err);
          });
      }
      if (operate === "readOnly") {
        window.axios
          .get("/api/folders/only")
          .then(res => {
            callS(res.data);
          })
          .catch(err => {
            console.error(err);
            callE(err);
          });
      }
      if (operate === "rename") {
        window.axios
          .put("/api/folders", {
            oldPath: folderInfo.oldFolder.path,
            newPath: folderInfo.folder.path
          })
          .then(res => {
            console.log(res);
            this.timeToast("重命名成功！", "success", 1000);
            if (res.data.error == false) {
              callS(res);
            } else {
              callE(res);
            }
          })
          .catch(err => {
            console.error(err);
            this.timeToast("重命名失败！请重试。", "error", 1000);
            callE(err);
          });
      }
      if (operate === "create") {
        window.axios
          .post("/api/folders", {
            path: folderInfo.path
          })
          .then(res => {
            this.timeToast("创建文件夹成功！", "success", 1000);
            if (res.data.error == false) {
              callS(res);
            } else {
              callE(res);
            }
          })
          .catch(err => {
            console.error(err);
            this.timeToast("创建文件夹失败！请重试。", "error", 1000);
            callE(err);
          });
      }
      if (operate === "delete") {
        window.axios
          .delete("/api/folders", {
            params: {
              path: folderInfo.path
            }
          })
          .then(res => {
            console.log(res);
            this.timeToast("删除成功！", "success", 1000);
            if (res.data.error == false) {
              callS(res);
            } else {
              callE(res);
            }
          })
          .catch(err => {
            console.error(err);
            this.timeToast("删除失败！请重试。", "error", 1000);
            callE(err);
          });
      }
      if (operate === "exist") {
        window.axios
          .get("/api/folders/exist", {
            params: { path: folderInfo.path }
          })
          .then(res => {
            callS(res.data);
          })
          .catch(err => {
            console.error(err);
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
    $route(to, from) {
      this.prevRouter = from.name;
      if (to.name === "Read") {
        this.readOpened = JSON.parse(JSON.stringify(this.xknoteOpened));
      }
    },
    "$route.query": function(query) {
      if (query.note) {
        let mode = "normal";
        if (this.$route.name === "Read") {
          mode = "read";
        }
        this.loadPathNote(query.note, mode);
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
