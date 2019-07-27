<template>
  <main class="home" ref="home">
    <template v-show="xknoteMode==='normal'">
      <header class="navbar xknote-header">
        <section class="navbar-section col-2">
          <img class="xknote-icon" src="https://note.ixk.me/img/logo.png" alt="XK-Note icon" />
          <a href="#" class="btn btn-link text-large">{ XK-Note }</a>
        </section>
        <section class="navbar-center">
          <input
            id="xknote-title"
            class="form-input"
            type="text"
            placeholder="Title"
            v-model="xknoteOpened.note.title"
          />
          <div class="dropdown">
            <div class="btn-group">
              <a href="#" class="btn">云端保存</a>
              <a href="#" class="btn dropdown-toggle" tabindex="0">
                <i class="icon icon-caret"></i>
              </a>
              <ul class="menu">
                <li class="menu-item">
                  <a href="#">本地保存</a>
                </li>
                <li class="menu-item">
                  <a href="#">全部保存到云端</a>
                </li>
                <li class="menu-item">
                  <a href="#">全部保存到本地</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="dropdown">
            <div class="btn-group">
              <a href="#" class="btn dropdown-toggle" tabindex="0">
                导出
                <i class="icon icon-caret"></i>
              </a>
              <ul class="menu">
                <li class="menu-item">
                  <a href="#">导出为Markdown文件</a>
                </li>
                <li class="menu-item">
                  <a href="#">导出HTML文件</a>
                </li>
                <li class="menu-item">
                  <a href="#">导出带样式的HTML文件</a>
                </li>
                <li class="menu-item">
                  <a href="#">导出阅读模式的HTML文件</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="dropdown">
            <div class="btn-group">
              <a href="#" class="btn dropdown-toggle" tabindex="0">
                操作
                <i class="icon icon-caret"></i>
              </a>
              <ul class="menu">
                <li class="divider" data-content="Git"></li>
                <li class="menu-item">
                  <a href="#">Push</a>
                </li>
                <li class="menu-item">
                  <a href="#">Pull</a>
                </li>
                <li class="menu-item">
                  <a href="#">Clone</a>
                </li>
                <li class="menu-item">
                  <a href="#">Init</a>
                </li>
                <li class="menu-item">
                  <a href="#">Push force</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="popover popover-bottom">
            <button class="btn">信息</button>
            <div class="popover-container">
              <div class="card">
                <div class="card-body">
                  <p>
                    创建时间：
                    <span>{{ xknoteOpened.note.created_at }}</span>
                  </p>
                  <p>
                    修改时间：
                    <span>{{ xknoteOpened.note.updated_at }}</span>
                  </p>
                  <p>
                    路径：
                    <span>{{ xknoteOpened.path }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="navbar-section">
          <div class="dropdown">
            <div class="btn-group">
              <a href="#" class="btn btn-primary">新建MD笔记</a>
              <a href="#" class="btn btn-primary dropdown-toggle" tabindex="0">
                <i class="icon icon-caret"></i>
              </a>
              <ul class="menu">
                <li class="menu-item">
                  <a href="#">新建文件夹</a>
                </li>
              </ul>
            </div>
          </div>
          <a href="#" class="btn btn-link">阅读模式</a>
          <a href="#" class="btn btn-link">写作模式</a>
          <div class="dropdown dropdown-right">
            <a href="#" class="btn btn-link dropdown-toggle" tabindex="0">
              { name }
              <i class="icon icon-caret"></i>
            </a>
            <ul class="menu">
              <li class="menu-item">
                <a href>个人中心</a>
              </li>
              <li class="menu-item">
                <a href>用户设置</a>
              </li>
              <li class="menu-item">
                <a href>Git设置</a>
              </li>
              <li class="menu-item">
                <a href>系统管理</a>
              </li>
              <li class="divider"></li>
              <li class="menu-item">
                <a href>登出</a>
              </li>
            </ul>
          </div>
        </section>
      </header>
      <div class="columns">
        <section class="column col-2 xknote-sidebar">
          <ul class="tab tab-block xknote-tab">
            <li class="tab-item">
              <!-- mark data-badge: 当前未保存的文章数量 -->
              <a
                href="#"
                :class="(currBadgeCount!==0 ? 'badge ' : '') + (xknoteTab==='curr' ? 'active' : '')"
                :data-badge="currBadgeCount"
                @click="switchTab('curr')"
              >当前</a>
            </li>
            <li :class="'tab-item ' + (xknoteTab==='cloud' ? 'active' : '')">
              <a href="#" @click="switchTab('cloud')">云端</a>
            </li>
            <li class="tab-item">
              <!-- mark data-badge: 未保存到云端的数量 -->
              <a
                href="#"
                :class="(localBadgeCount!==0 ? 'badge ' : '') + (xknoteTab==='local' ? 'active' : '')"
                :data-badge="localBadgeCount"
                @click="switchTab('local')"
              >本地</a>
            </li>
          </ul>
          <ul class="xknote-tab-content">
            <li v-show="xknoteTab==='curr'">
              <ul class="menu menu-nav">
                <li class="menu-item" v-for="(item, index) in currList" :key="item.id">
                  <!-- mark data-badge: N为未保存，L为已经保存到本地，若已经保存到云端则不显示badge -->
                  <note-item :info="item" :status="item.status" :index="index" :storage="'curr'" />
                </li>
                <div class="text-gray text-center" v-if="currList.length===0">这里什么都没有哦（￣︶￣）↗</div>
              </ul>
            </li>
            <li v-show="xknoteTab==='cloud'">
              <folder-item
                v-for="(item, index) in cloudList"
                :key="item.id"
                :info="item"
                :index="index"
                :storage="'cloud'"
              />
              <template v-if="cloudList.length===0">
                <div class="loading loading-lg"></div>
                <div class="text-gray text-center">正在加载，客官莫急。</div>
              </template>
            </li>
            <li v-show="xknoteTab==='local'">
              <ul class="menu menu-nav">
                <li class="menu-item" v-for="(item, index) in localList" :key="item.id">
                  <!-- mark data-badge: N为未保存，L为已经保存到本地，若已经保存到云端则不显示(C)badge -->
                  <note-item :info="item" :status="item.status" :index="index" :storage="'local'" />
                </li>
                <div class="text-gray text-center" v-if="localList.length===0">这里什么都没有哦（￣︶￣）↗</div>
              </ul>
            </li>
          </ul>
          <div class="xknote-copyright bg-gray">
            ©
            <a href="https://github.com/syfxlin/xknote">XK-Note</a> By
            <a href="https://ixk.me">Otstar Lin</a>
          </div>
        </section>
        <section class="column col-10" id="xknote-editor">
          <xk-editor
            :settingApi="xknoteSetting"
            :contentProps="xknoteOpened.note.content"
            v-on:loadHook="editorLoaded"
          />
        </section>
      </div>
      <div class="components">
        <ul class="menu float-menu col-1" v-show="floatMenu.show">
          <li class="menu-item" v-for="item in floatMenu.items" :key="item.id">
            <template v-if="item.name==='saveAndClose'">
              <label class="form-switch">
                <input type="checkbox" v-model="floatMenu.saveAndClose" />
                <i class="form-icon"></i> 保存后关闭
              </label>
            </template>
            <a @click="floatMenuClick(item.operate)" v-else>{{ item.name }}</a>
          </li>
        </ul>
        <div :class="'modal modal-sm xknote-sm-modal' + (smModal.show ? ' active' : '')">
          <a href="#close" class="modal-overlay" aria-label="Close"></a>
          <div class="modal-container">
            <div class="modal-header">
              <div class="modal-title h5">{{ smModal.title }}</div>
            </div>
            <div class="modal-body">
              <div class="content">{{ smModal.content }}</div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" @click="smModal.confirm()">确认</button>
              <button class="btn btn-link" @click="smModal.cancel()">取消</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<script>
import XK_Editor from "xkeditor";
import noteItem from "./noteItem.vue";
import folderItem from "./folderItem.vue";
import "../assets/style.css";
export default {
  name: "home",
  components: {
    "xk-editor": XK_Editor,
    "note-item": noteItem,
    "folder-item": folderItem
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
          content: " ",
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
          content: " ",
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
      // 防止openNote时的文档修改引发的标记改变
      xknoteOpenedChangeFlag: true,
      xknoteSetting: "/static/setting.json",
      // 暂时无用，即正常模式，阅读模式，写作模式
      xknoteMode: "normal",
      xknoteTab: "cloud",
      // currList的扩展信息
      currListSource: [
        //   {}, {}
      ],
      currList: [
        // {
        //   type: "note",
        //   path: "uid_1/C语言学习笔记.md",
        //   name: "C语言学习笔记.md",
        //   status: "N",
        //   note: {
        //     title: "C语言学习笔记",
        //     author: "Otstar Lin",
        //     content: "C语言学习笔记-content",
        //     created_at: "2019/7/27 21:52:15",
        //     updated_at: "2019/7/27 21:52:15"
        //   }
        // },
        // {
        //   type: "note",
        //   path: "uid_1/public/PHP学习笔记.md",
        //   name: "PHP学习笔记.md",
        //   status: "N",
        //   note: {
        //     title: "PHP学习笔记",
        //     author: "Otstar Lin",
        //     content: "PHP学习笔记-content",
        //     created_at: "2019/7/27 21:52:15",
        //     updated_at: "2019/7/27 21:52:15"
        //   }
        // }
      ],
      cloudList: [],
      localList: [],
      smModal: {
        show: false,
        title: "",
        content: "",
        confirm: () => {},
        cancel: () => {}
      },
      floatMenu: {
        show: false,
        items: [],
        saveAndClose: true
      }
    };
  },
  computed: {
    // 计算在Tab bar上的计数
    currBadgeCount() {
      let count = 0;
      this.currList.forEach(item => {
        if (item.status === "N") {
          count++;
        }
      });
      return count;
    },
    localBadgeCount() {
      let count = 0;
      this.localList.forEach(item => {
        if (item.status === "L") {
          count++;
        }
      });
      return count;
    }
  },
  methods: {
    // 切换Tab
    switchTab(tabName) {
      this.xknoteTab = tabName;
    },
    // 读取云端的文件夹及笔记
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
    // 读取本地的笔记
    loadLocalNotes() {
      this.noteLocalDB("readAll", "", (e, list) => {
        this.localList = list;
      });
    },
    // 操作本地笔记数据库
    noteLocalDB(
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
      requset.onsuccess = () => {
        db = requset.result;
        os = db
          .transaction(["localList"], "readwrite")
          .objectStore("localList");
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
          let noteInfo = null;
          let req = os.getAll(data);
          req.onsuccess = e => {
            noteInfo = req.result;
            callS(e, noteInfo);
          };
          req.onerror = e => {
            console.log("数据读取失败: " + e);
            callE(e);
          };
        }
        if (operate === "readAll") {
          let noteList = null;
          let req = os.getAll();
          req.onsuccess = e => {
            noteList = req.result;
            callS(e, noteList);
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
      };
      requset.onupgradeneeded = e => {
        db = e.target.result;
        if (!db.objectStoreNames.contains("localList")) {
          console.log("indexedDB中不存在localList表");
          os = db.createObjectStore("localList", {
            keyPath: "name"
          });
        }
      };
    },
    // 操作列表
    listOperate(operate, storage, index = "", noteInfo = null) {
      let arr = [];
      let list;
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
        if (storage === "curr" || storage === "local") {
          return this[storage + "List"].push(noteInfo) - 1;
        }
      }
      if (operate === "get") {
        return list[arr[arr.length - 1]];
      }
    },
    // 操作笔记
    noteOperate(operate, storage, noteInfo = null) {
      if (operate === "delete") {
        if (storage === "local") {
          this.noteLocalDB("delete", noteInfo.name);
        }
        // TODO: 云端删除
      }
      if (operate === "save") {
        if (storage === "local") {
          this.noteLocalDB("delete", noteInfo.name);
          this.noteLocalDB("add", noteInfo);
        }
        if (storage === "cloud") {
          // TODO: 云端保存
        }
      }
      if (operate === "rename") {
        if (storage === "local") {
          this.noteLocalDB("delete", noteInfo.oldNote.name);
          this.noteLocalDB("add", noteInfo.note);
        }
        if (storage === "cloud") {
          // TODO: 云端重命名
        }
      }
    },
    // 浮动菜单选项点击事件
    floatMenuClick(operate) {
      this.floatMenu.show = false;
      // 以下的curr storage index对应点击的笔记
      let curr = window.xknote.currClickTarget;
      let storage = curr.getAttribute("data-storage");
      let index = curr.getAttribute("data-index");
      if (operate === "delete") {
        this.smModal.title = "删除";
        this.smModal.content = "是否删除该文件(文件夹)？(此操作不可逆)";
        this.smModal.show = true;
        this.smModal.confirm = () => {
          let note = null;
          note = this.listOperate("delete", storage, index);
          this.smModal.show = false;
          this.noteOperate(operate, storage, note);
        };
        this.smModal.cancel = () => {
          this.smModal.show = false;
        };
      }
      // 保存到本地
      if (operate === "saveLocal") {
        if (storage === "curr") {
          let note = null;
          if (this.currListSource[index]) {
            this.listOperate(
              "delete",
              "local",
              this.currListSource[index].index + ""
            );
          }
          if (this.floatMenu.saveAndClose) {
            note = this.listOperate("delete", "curr", index);
            this.setXknoteOpened(this.noteBaseInfo);
          } else {
            note = this.listOperate("get", "curr", index);
          }
          note.status = "L";
          let localIndex = this.listOperate("add", "local", "", note);
          if (!this.floatMenu.saveAndClose) {
            this.currListSource[index] = {
              index: localIndex,
              storage: "local"
            };
          }
          this.noteOperate("save", "local", note);
        }
        if (storage === "cloud") {
          // TODO: 将云端的笔记拷贝至本地，即保存
          // 先读取云端笔记，然后添加至本地
        }
      }
      if (operate === "rename") {
        // TODO: currList中的笔记重命名影响至实体，即本地存储和云端存储
        let note = this.listOperate("get", storage, index);
        let oldNote = note;
        curr.querySelector(".tile-content").setAttribute("children", "input");
        let input = curr.querySelector(".tile-content > input");
        let keyEv = e => {
          if (e.key === "Enter") {
            let value = e.target.value;
            note.path = note.path.replace(note.name, value);
            note.name = value;
            curr.querySelector(".tile-content").removeAttribute("children");
            input.removeEventListener("keydown", keyEv);
            this.noteOperate(operate, storage, {
              oldNote: oldNote,
              note: note
            });
          }
        };
        input.addEventListener("keydown", keyEv);
      }
      if (operate === "closeCurr") {
        let closeCurr = () => {
          if (index == this.xknoteOpenedIndex.curr) {
            this.setXknoteOpened(this.noteBaseInfo);
          }
          this.listOperate("delete", "curr", index);
        };
        if (this.listOperate("get", storage, index).status === "N") {
          this.smModal.title = "关闭";
          this.smModal.content = "该文件未保存，是否关闭该文件？(此操作不可逆)";
          this.smModal.show = true;
          this.smModal.confirm = () => {
            closeCurr();
            this.smModal.show = false;
          };
          this.smModal.cancel = () => {
            this.smModal.show = false;
          };
        } else {
          closeCurr();
        }
      }
    },
    // 打开笔记
    openNote(note, source) {
      this.xknoteOpenedChangeFlag = false;
      // 加载到xknoteOpened，由于XKEditor不能自动修改数据，所以需要手动设置数据
      this.setXknoteOpened(note);
      // 添加到currList，同时将源数据添加到currListSource
      let len;
      if (source.storage !== "curr") {
        len = this.currList.push(note);
        this.currListSource.push(source);
        this.xknoteOpenedIndex.curr = len - 1;
      } else {
        this.xknoteOpenedIndex.curr = parseInt(source.index);
      }
      this.xknoteOpenedIndex.source = source;
      this.xknoteTab = "curr";
      this.$nextTick(() => {
        this.xknoteOpenedChangeFlag = true;
      });
      // TODO: 开启的Note在当前列表中获得active效果
    },
    setXknoteOpened(noteInfo) {
      this.xknoteOpened = noteInfo;
      if (window.eThis.e.editorMode === "ace") {
        window.XKEditor.setMarkdown(noteInfo.note.content);
      } else {
        window.XKEditor.switchEditor();
        window.XKEditor.setMarkdown(noteInfo.note.content);
      }
    },
    editorLoaded(e) {
      if (e === "interfaceLoad") {
        window.XKEditor.ace.getSession().on("change", () => {
          this.xknoteOpened.note.content = window.XKEditor.getMarkdown();
        });
      }
    },
    watchNote() {
      if (!this.xknoteOpenedChangeFlag) return;
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
  mounted() {
    this.loadCloudFolders();
    this.loadLocalNotes();
    window.xknote = {};
  },
  watch: {
    "xknoteOpened.note.content": "watchNote",
    "xknoteOpened.note.title": "watchNote"
  }
};
</script>

<style>
</style>
