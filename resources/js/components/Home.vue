<template>
  <main class="home">
    <header class="navbar xknote-header">
      <section class="navbar-section col-2">
        <img class="xknote-icon" src="https://note.ixk.me/img/logo.png" alt="XK-Note icon" />
        <a href="#" class="btn btn-link text-large">{ XK-Note }</a>
        <transition name="fade" mode="out-in">
          <button
            class="btn btn-action btn-lg"
            title="开启/关闭侧边栏"
            v-if="writeMode"
            @click="showSidebar=!showSidebar"
          >
            <i class="icon icon-menu"></i>
          </button>
        </transition>
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
            <a @click="navBarOperate('saveCloud')" class="btn">云端保存</a>
            <a href="#" class="btn dropdown-toggle" tabindex="0">
              <i class="icon icon-caret"></i>
            </a>
            <ul class="menu">
              <li class="menu-item">
                <a @click="navBarOperate('saveLocal')">本地保存</a>
              </li>
              <li class="menu-item">
                <a @click="navBarOperate('saveAllCloud')">全部保存到云端</a>
              </li>
              <li class="menu-item">
                <a @click="navBarOperate('saveAllLocal')">全部保存到本地</a>
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
                <a @click="navBarOperate('downloadMarkdown')">导出为Markdown文件</a>
              </li>
              <li class="menu-item">
                <a @click="navBarOperate('downloadHTML')">导出HTML文件</a>
              </li>
              <li class="menu-item">
                <a @click="navBarOperate('downloadFullHTML')">导出带样式的HTML文件</a>
              </li>
              <li class="menu-item">
                <a @click="navBarOperate('downloadReadHTML')">导出阅读模式的HTML文件</a>
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
            <a class="btn btn-primary" @click="navBarOperate('showCreateNote')">新建MD笔记</a>
            <a class="btn btn-primary dropdown-toggle" tabindex="0">
              <i class="icon icon-caret"></i>
            </a>
            <ul class="menu">
              <li class="menu-item">
                <a @click="navBarOperate('showCreateFolder')">新建文件夹</a>
              </li>
            </ul>
          </div>
        </div>
        <router-link to="/read" class="btn btn-link">阅读模式</router-link>
        <router-link v-if="!writeMode" to="/write" class="btn btn-link">写作模式</router-link>
        <router-link v-if="writeMode" to="/" class="btn btn-link">普通模式</router-link>
        <div class="dropdown dropdown-right">
          <a href="#" class="btn btn-link dropdown-toggle" tabindex="0">
            { name }
            <i class="icon icon-caret"></i>
          </a>
          <ul class="menu">
            <li class="menu-item">
              <a @click="navBarOperate('showPersonalCenter')">个人中心</a>
            </li>
            <li class="menu-item">
              <a @click="navBarOperate('showUserSetting')">用户设置</a>
            </li>
            <li class="menu-item">
              <a @click="navBarOperate('showGitSetting')">Git设置</a>
            </li>
            <li class="menu-item">
              <a @click="navBarOperate('showSystemSetting')">系统管理</a>
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
      <transition name="fade" mode="out-in">
        <section
          :class="'column col-2 xknote-sidebar' + (!writeMode ? '' : ' write-mode')"
          v-show="!writeMode||showSidebar"
        >
          <ul class="tab tab-block xknote-tab">
            <li class="tab-item">
              <!-- mark data-badge: 当前未保存的文章数量 -->
              <a
                :class="(currBadgeCount!==0 ? 'badge ' : '') + (xknoteTab==='curr' ? 'active' : '')"
                :data-badge="currBadgeCount"
                @click="switchTab('curr')"
              >当前</a>
            </li>
            <li :class="'tab-item ' + (xknoteTab==='cloud' ? 'active' : '')">
              <a @click="switchTab('cloud')">云端</a>
            </li>
            <li class="tab-item">
              <!-- mark data-badge: 未保存到云端的数量 -->
              <a
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
                  <note-item
                    :info="item"
                    :status="item.status"
                    :index="index"
                    :storage="'curr'"
                    :mode="'normal'"
                    :openNote="openNote"
                    :floatMenu="floatMenu"
                  />
                </li>
                <div class="text-gray text-center" v-if="currList.length===0">这里什么都没有哦（￣︶￣）↗</div>
              </ul>
            </li>
            <li v-show="xknoteTab==='cloud'" class="cloud-tab">
              <folder-item
                v-for="(item, index) in cloudList"
                :key="item.id"
                :info="item"
                :index="index"
                :storage="'cloud'"
                :mode="'normal'"
                :openNote="openNote"
                :floatMenu="floatMenu"
              />
              <div class="cloud-tab-loading" v-if="cloudList.length===0">
                <div class="loading loading-lg"></div>
                <div class="text-gray text-center">正在加载，客官莫急。</div>
              </div>
            </li>
            <li v-show="xknoteTab==='local'">
              <ul class="menu menu-nav">
                <li class="menu-item" v-for="(item, index) in localList" :key="item.id">
                  <!-- mark data-badge: N为未保存，L为已经保存到本地，若已经保存到云端则不显示(C)badge -->
                  <note-item
                    :info="item"
                    :status="item.status"
                    :index="index"
                    :storage="'local'"
                    :mode="'normal'"
                    :openNote="openNote"
                    :floatMenu="floatMenu"
                  />
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
      </transition>
      <section :class="'column ' + (!writeMode ? 'col-10' : 'col-12')" id="xknote-editor">
        <xk-editor
          :settingApi="xknoteSetting"
          :contentProps="xknoteOpened.note.content"
          v-on:loadHook="editorLoaded"
          v-show="loadedEditor"
          :class="!writeMode ? '' : 'col-8'"
        />
        <div v-show="!loadedEditor" class="editor-loading">
          <div class="loading loading-lg"></div>
          <p>Editor加载中，请稍后。</p>
        </div>
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
          <a @click="floatMenuOperate(item.operate)" v-else>{{ item.name }}</a>
        </li>
      </ul>
      <div :class="'modal modal-sm xknote-sm-modal' + (smModal.show ? ' active' : '')">
        <a class="modal-overlay"></a>
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
      <div :class="'modal modal-lg xknote-lg-modal' + (lgModal.show ? ' active' : '')">
        <a class="modal-overlay"></a>
        <div class="modal-container" role="document">
          <div class="modal-header">
            <a class="btn btn-clear float-right" @click="lgModal.cancel()"></a>
            <div class="modal-title h5">{{ lgModal.title }}</div>
          </div>
          <div class="modal-body">
            <div class="content">
              <template v-if="lgModal.content==='CreateNote'">createNote</template>
              <template v-if="lgModal.content==='CreateFolder'">createFolder</template>
              <template v-if="lgModal.content==='PersonalCenter'">personalCenter</template>
              <template v-if="lgModal.content==='UserSetting'">userSetting</template>
              <template v-if="lgModal.content==='GitSetting'">gitSetting</template>
              <template v-if="lgModal.content==='SystemSetting'">systemSetting</template>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="lgModal.confirm()">确定</button>
            <button class="btn btn-link" @click="lgModal.cancel()">取消</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import XK_Editor from "xkeditor";
import noteItem from "./noteItem.vue";
import folderItem from "./folderItem.vue";
export default {
  name: "home",
  components: {
    "xk-editor": XK_Editor,
    "note-item": noteItem,
    "folder-item": folderItem
  },
  props: [
    "xknoteTab",
    "switchTab",
    "currListSource",
    "currList",
    "cloudList",
    "localList",
    "xknoteOpened",
    "xknoteOpenedIndex",
    "noteBaseInfo",
    "loadFirstNote",
    "listOperate",
    "noteOperate",
    "setXknoteOpened",
    "openNote",
    "writeMode"
  ],
  data() {
    return {
      showSidebar: false, // 该属性只有在writeMode有用
      loadedEditor: false,
      xknoteSetting: "/static/setting.json",
      smModal: {
        show: false,
        title: "",
        content: "",
        confirm: () => {},
        cancel: () => {
          this.smModal.show = false;
        }
      },
      lgModal: {
        show: false,
        title: "",
        content: "",
        confirm: () => {},
        cancel: () => {
          this.lgModal.show = false;
        }
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
    switchWriteMode() {
      window.XKEditor.switchTypewriter();
      window.XKEditor.switchPreview();
    },
    /**
     * 在XK Editor加载完成时触发的事件
     * @param {string} e event的名称
     * @returns void
     */
    editorLoaded(e) {
      if (e === "interfaceLoad") {
        window.XKEditor.ace.getSession().on("change", () => {
          if (window.xknoteOpenedChangeFlag) {
            this.xknoteOpened.note.content = window.XKEditor.getMarkdown();
          }
        });
      }
      if (e === "componentLoad") {
        this.loadFirstNote();
        this.loadedEditor = true;
        if (this.writeMode) {
          this.switchWriteMode();
        }
      }
    },
    /**
     * 操作列表
     * @param {string} operate 操作名称
     * @param {string} storage 要操作对象存储的位置
     * @param {string} index 要操作对象的索引
     * @param {object=} curr 当前操作的item的dom对象
     * @returns void
     */
    memuOperate(operate, storage, index, curr = null) {
      this.floatMenu.show = false;
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
          // 若是从localList中打开的笔记，为了保存不重复，需要先清空
          if (this.currListSource[index]) {
            this.listOperate(
              "delete",
              "local",
              this.currListSource[index].index
            );
          }
          // 判断保存时是否需要关闭currList的副本
          if (this.floatMenu.saveAndClose) {
            note = this.listOperate("delete", "curr", index);
            this.setXknoteOpened(JSON.parse(JSON.stringify(this.noteBaseInfo)));
          } else {
            note = this.listOperate("get", "curr", index);
          }
          note.status = "L";
          let localIndex = this.listOperate("add", "local", "", note);
          // 若不是从localList中打开的文件就不会有currListSource的信息，如果用户选择不关闭保存，则需要添加source信息，防止后续操作出现问题
          if (!this.floatMenu.saveAndClose) {
            this.currListSource[index] = {
              index: localIndex,
              storage: "local"
            };
            // this.$emit("update:currListSource", this.currListSource);
          }
          // 保存到本地（实际操作）
          this.noteOperate("save", "local", note);
        }
        if (storage === "cloud") {
          // TODO: 将云端的笔记拷贝至本地，即保存
          // 先读取云端笔记，然后添加至本地
        }
      }
      if (operate === "rename") {
        // 先获取到旧的Note信息，为了防止对象的变动所以需要克隆对象，利用json转换即可方便克隆对象
        let note = this.listOperate("get", storage, index);
        let oldNote = JSON.parse(JSON.stringify(note));
        // 更改item为输入框
        curr.querySelector(".tile-content").setAttribute("children", "input");
        let input = curr.querySelector(".tile-content > input");
        let keyEv = e => {
          if (e.key === "Enter") {
            let value = e.target.value;
            note.path = note.path.replace(note.name, value);
            note.name = value;
            curr.querySelector(".tile-content").removeAttribute("children");
            input.removeEventListener("keydown", keyEv);
            let s = storage;
            if (storage === "curr") {
              s = this.currListSource[index].storage;
            }
            this.noteOperate(operate, s, {
              oldNote: oldNote,
              note: note
            });
          }
        };
        input.addEventListener("keydown", keyEv);
      }
      if (operate === "closeCurr") {
        // 如果笔记在未保存状态关闭则先弹出modal提示是否下关闭
        let closeCurr = () => {
          if (index == this.xknoteOpenedIndex.curr) {
            this.setXknoteOpened(JSON.parse(JSON.stringify(this.noteBaseInfo)));
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
    /**
     * 浮动菜单选项点击事件
     * @param {string} operate 操作名称
     * @returns void
     */
    floatMenuOperate(operate) {
      // 以下的curr storage index对应点击的笔记
      let curr = window.xknote.currClickTarget;
      let storage = curr.getAttribute("data-storage");
      let index = curr.getAttribute("data-index");
      this.memuOperate(operate, storage, index, curr);
    },
    /**
     * header菜单选项点击事件
     * @param {string} operate 操作名称
     * @returns void
     */
    navBarOperate(operate) {
      if (operate.indexOf("show") === 0) {
        this.lgModal.show = true;
        this.lgModal.content = operate.substring(4);
      }
      let saveLocal = i => {
        this.floatMenu.saveAndClose = false;
        this.memuOperate("saveLocal", "curr", i);
        this.floatMenu.saveAndClose = true;
      };
      if (operate === "saveLocal") {
        saveLocal(this.xknoteOpenedIndex.curr);
      }
      if (operate === "saveAllLocal") {
        this.currList.forEach((item, index) => {
          if (item.status !== "L") {
            saveLocal(index);
          }
        });
      }
      if (operate === "downloadMarkdown") {
        window.XKEditor.download(
          this.xknoteOpened.name.replace(".md", ""),
          "markdown"
        );
      }
      if (operate === "downloadHTML") {
        window.XKEditor.download(
          this.xknoteOpened.name.replace(".md", ""),
          "html"
        );
      }
      if (operate === "downloadFullHTML") {
        window.XKEditor.download(
          this.xknoteOpened.name.replace(".md", ""),
          "fullhtml"
        );
      }
      // TODO: 导出阅读模式的HTML
    }
  },
  mounted() {},
  watch: {
    writeMode() {
      this.switchWriteMode();
    }
  }
};
</script>

<style>
</style>
