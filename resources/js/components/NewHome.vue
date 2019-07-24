<template>
  <main class="home">
    <template v-show="xknoteMode==='normal'">
      <header class="navbar xknote-header">
        <section class="navbar-section col-2">
          <img class="xknote-icon" src="https://note.ixk.me/img/logo.png" alt="XK-Note icon" />
          <a href="#" class="btn btn-link text-large">{ XK-Note }</a>
        </section>
        <section class="navbar-center">
          <input class="form-input" type="text" placeholder="Title" />
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
                    <span>{ createTime }</span>
                  </p>
                  <p>
                    修改时间：
                    <span>{ updateTime }</span>
                  </p>
                  <p>
                    路径：
                    <span>{ path }</span>
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
                :class="currBadgeCount!==0 ? 'badge' : ''"
                :data-badge="currBadgeCount"
                @click="switchTab('curr', $event)"
              >当前</a>
            </li>
            <li class="tab-item active">
              <a href="#" @click="switchTab('cloud', $event)">云端</a>
            </li>
            <li class="tab-item">
              <!-- mark data-badge: 未保存到云端的数量 -->
              <a
                href="#"
                :class="localBadgeCount!==0 ? 'badge' : ''"
                :data-badge="localBadgeCount"
                @click="switchTab('local', $event)"
              >本地</a>
            </li>
          </ul>
          <ul class="xknote-tab-content">
            <li id="tab-item-curr" class="d-none">
              <ul class="menu menu-nav">
                <li class="menu-item" v-for="item in currList" :key="item.id">
                  <!-- mark data-badge: N为未保存，L为已经保存到本地，若已经保存到云端则不显示badge -->
                  <note-item :info="item" :badge="item.badge" />
                </li>
                <div class="text-gray text-center" v-if="currList.length===0">这里什么都没有哦（￣︶￣）↗</div>
              </ul>
            </li>
            <li id="tab-item-cloud">
              <folder-item v-for="item in cloudList" :key="item.id" :info="item" />
              <template v-if="cloudList.length===0">
                <div class="loading loading-lg"></div>
                <div class="text-gray text-center">正在加载，客官莫急。</div>
              </template>
            </li>
            <li id="tab-item-local" class="d-none">
              <ul class="menu menu-nav">
                <li class="menu-item" v-for="item in localList" :key="item.id">
                  <!-- mark data-badge: N为未保存，L为已经保存到本地，若已经保存到云端则不显示badge -->
                  <note-item :info="item" :badge="item.badge" />
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
          <xk-editor :settingApi="setting" :contentApi="content" />
        </section>
      </div>
      <div class="components">
        <ul class="menu folder-settings col-1 d-none">
          <li class="menu-item">
            <a href="#">重命名</a>
          </li>
          <li class="menu-item">
            <a href>删除</a>
          </li>
        </ul>
        <ul class="menu note-settings col-1 d-none">
          <li class="menu-item">
            <a href="#">重命名(移动)</a>
          </li>
          <li class="menu-item">
            <a href>删除</a>
          </li>
        </ul>
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
  name: "Home",
  components: {
    "xk-editor": XK_Editor,
    "note-item": noteItem,
    "folder-item": folderItem
  },
  data() {
    return {
      xknoteMode: "normal",
      currList: [
        {
          type: "note",
          path: "uid_1/C语言学习笔记2.md",
          name: "C语言学习笔记2.md",
          badge: "N"
        },
        {
          type: "note",
          path: "uid_1/public/PHP学习笔记2.md",
          name: "PHP学习笔记2.md",
          badge: "L"
        }
      ],
      cloudList: [],
      localList: [],
      setting: "/static/setting.json",
      content: "/static/md_content.md"
    };
  },
  computed: {
    currBadgeCount() {
      let count = 0;
      this.currList.forEach(item => {
        if (item.badge === "N") {
          count++;
        }
      });
      return count;
    },
    localBadgeCount() {
      let count = 0;
      this.localList.forEach(item => {
        if (item.badge === "L") {
          count++;
        }
      });
      return count;
    }
  },
  methods: {
    switchTab(tabName, e) {
      document
        .querySelector(".xknote-tab > .active")
        .classList.remove("active");
      e.target.parentElement.classList.add("active");
      var tabId = "tab-item-" + tabName;
      document.querySelector(
        ".xknote-tab-content > li:not(.d-none)"
      ).className = "d-none";
      document.getElementById(tabId).className = "";
    },
    showFolderSetting(e) {
      var f = document.getElementsByClassName("folder-settings")[0];
      f.style.top = e.clientY + "px";
      f.style.left = e.clientX + "px";
      f.classList.remove("d-none");
      var offset = {
        xS: e.clientX,
        yS: e.clientY,
        xE: e.clientX + f.clientWidth,
        yE: e.clientY + f.clientHeight
      };
      e.stopPropagation();
      var closeF = function(ev) {
        if (
          ev.clientX < offset.xS ||
          ev.clientX > offset.xE ||
          ev.clientY < offset.yS ||
          ev.clientY > offset.yE
        ) {
          f.classList.add("d-none");
        }
        document.removeEventListener("click", closeF);
      };
      document.addEventListener("click", closeF);
    },
    showNoteSettings(e) {
      var n = document.getElementsByClassName("note-settings")[0];
      n.style.top = e.clientY + "px";
      n.style.left = e.clientX + "px";
      n.classList.remove("d-none");
      var offset = {
        xS: e.clientX,
        yS: e.clientY,
        xE: e.clientX + n.clientWidth,
        yE: e.clientY + n.clientHeight
      };
      e.stopPropagation();
      var closeN = function(ev) {
        if (
          ev.clientX < offset.xS ||
          ev.clientX > offset.xE ||
          ev.clientY < offset.yS ||
          ev.clientY > offset.yE
        ) {
          n.classList.add("d-none");
        }
        document.removeEventListener("click", closeN);
      };
      document.addEventListener("click", closeN);
    },
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
    loadLocalNotes() {
      let _this = this;
      this.noteLocalDB("readAll", "", (e, data) => {
        this.localList = data;
      });
    },
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
          let reData = null;
          let req = os.getAll(data);
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
    }
  },
  mounted() {
    this.loadCloudFolders();
    this.loadLocalNotes();
  }
};
</script>

<style>
</style>
