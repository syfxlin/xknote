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
        <dropdown
          v-for="item in navBarListC"
          :key="item.id"
          :mainItem="item.mainItem"
          :items="item.items"
          :operate="navBarOperate"
        />
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
        <dropdown
          :mainItem="navBarListR[0].mainItem"
          :items="navBarListR[0].items"
          :operate="navBarOperate"
        />
        <router-link to="/read" class="btn btn-link">阅读模式</router-link>
        <router-link v-if="!writeMode" to="/write" class="btn btn-link">写作模式</router-link>
        <router-link v-if="writeMode" to="/" class="btn btn-link">普通模式</router-link>
        <dropdown
          :mainItem="navBarListR[1].mainItem"
          :items="navBarListR[1].items"
          :operate="navBarOperate"
          :right="true"
        />
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
            <li v-show="xknoteTab==='curr'" class="curr-tab">
              <ul class="menu menu-nav">
                <li class="menu-item" v-for="item in currList" :key="item.id">
                  <!-- mark data-badge: N为未保存，L为已经保存到本地，若已经保存到云端则不显示badge -->
                  <note-item
                    :info="item"
                    :status="item.status"
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
                v-for="item in cloudList"
                :key="item.id"
                :info="item"
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
            <li v-show="xknoteTab==='local'" class="local-tab">
              <ul class="menu menu-nav">
                <li class="menu-item" v-for="item in localList" :key="item.id">
                  <!-- mark data-badge: N为未保存，L为已经保存到本地，若已经保存到云端则不显示(C)badge -->
                  <note-item
                    :info="item"
                    :status="item.status"
                    :storage="'local'"
                    :mode="'normal'"
                    :openNote="openNote"
                    :floatMenu="floatMenu"
                  />
                </li>
                <button
                  @click="checkLocalStatus"
                  class="btn xknote-check-local"
                  title="对比本地笔记和云端笔记的时间差别"
                >检查状态</button>
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
          settingApi="/api/user/conf"
          :contentProps="xknoteOpened.note.content"
          v-on:loadHook="editorLoaded"
          v-show="loadedEditor"
          :class="!writeMode ? '' : 'col-8'"
          ref="xkeditor"
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
              <i class="form-icon"></i>
              {{ item.content }}
            </label>
          </template>
          <template v-else-if="item.name==='divider'">
            <li :data-content="item.content" class="divider"></li>
          </template>
          <a @click="floatMenuOperate(item.operate)" v-else>{{ item.name }}</a>
        </li>
      </ul>
      <modal :data="smModal" :size="'sm'">{{ smModal.content }}</modal>
      <modal :data="lgModal" :size="'lg'">
        <template v-if="lgModal.content==='CreateNote'">
          <div class="form-horizontal">
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">文档名</label>
              </div>
              <div class="col-9 col-sm-12 has-icon-right">
                <input
                  :class="'form-input' + (lgModal.data.status === 'error' ? ' is-error' : '')"
                  type="text"
                  v-model="lgModal.data.filename"
                  required
                />
                <i
                  :class="'form-icon icon' + (lgModal.data.status === 'loading' ? ' loading' : '')"
                ></i>
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">标题</label>
              </div>
              <div class="col-9 col-sm-12">
                <input class="form-input" type="text" v-model="lgModal.data.title" required />
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">云端/本地</label>
              </div>
              <div class="col-9 col-sm-12">
                <select class="form-select" v-model="lgModal.data.storage" required>
                  <option value="cloud">云端</option>
                  <option value="local">本地</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">存放的文件夹</label>
              </div>
              <div class="col-9 col-sm-12">
                <input class="form-input" type="text" v-model="lgModal.data.select" required />
                <div v-if="!lgModal.data.folders">
                  <div class="loading"></div>
                  <div class="text-gray text-center">正在加载，客官莫急。</div>
                </div>
                <template v-else>
                  <hr />
                  <only-folder-item
                    v-for="item in lgModal.data.folders"
                    :key="item.id"
                    :info="item"
                    :lgModal="lgModal"
                  />
                </template>
              </div>
            </div>
          </div>
        </template>
        <template v-if="lgModal.content==='CreateFolder'">
          <div class="form-horizontal">
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">文件夹名</label>
              </div>
              <div class="col-9 col-sm-12 has-icon-right">
                <input
                  :class="'form-input' + (lgModal.data.status === 'error' ? ' is-error' : '')"
                  type="text"
                  v-model="lgModal.data.foldername"
                  required
                />
                <i
                  :class="'form-icon icon' + (lgModal.data.status === 'loading' ? ' loading' : '')"
                ></i>
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">存放的文件夹</label>
              </div>
              <div class="col-9 col-sm-12">
                <input class="form-input" type="text" v-model="lgModal.data.select" required />
                <div v-if="!lgModal.data.folders">
                  <div class="loading"></div>
                  <div class="text-gray text-center">正在加载，客官莫急。</div>
                </div>
                <template v-else>
                  <hr />
                  <only-folder-item
                    v-for="item in lgModal.data.folders"
                    :key="item.id"
                    :info="item"
                    :lgModal="lgModal"
                  />
                </template>
              </div>
            </div>
          </div>
        </template>
        <template v-if="lgModal.content==='PersonalCenter'">personalCenter</template>
        <template v-if="lgModal.content==='UserConfig'">
          <div class="form-horizontal">
            <div
              class="form-group"
              v-for="(value, key) in $refs.xkeditor.setting.aceSetting"
              :key="key"
            >
              <div class="col-3 col-sm-12">
                <!-- TODO: 重命名 -->
                <label class="form-label">{{ settingList[key] }}</label>
              </div>
              <div class="col-9 col-sm-12 has-icon-right">
                <input
                  class="form-input"
                  type="text"
                  v-model="$refs.xkeditor.setting.aceSetting[key]"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-if="lgModal.content==='GitConfig'">
          <div class="form-horizontal">
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Git用户名</label>
              </div>
              <div class="col-9 col-sm-12 has-icon-right">
                <input class="form-input" type="text" v-model="lgModal.data.git_name" required />
                <i
                  :class="'form-icon icon' + (lgModal.data.status === 'loading' ? ' loading' : '')"
                ></i>
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Git邮箱</label>
              </div>
              <div class="col-9 col-sm-12 has-icon-right">
                <input class="form-input" type="email" v-model="lgModal.data.git_email" required />
                <i
                  :class="'form-icon icon' + (lgModal.data.status === 'loading' ? ' loading' : '')"
                ></i>
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Git密码</label>
              </div>
              <div class="col-9 col-sm-12">
                <input
                  class="form-input"
                  type="password"
                  v-model="lgModal.data.git_password"
                  required
                />
              </div>
            </div>
          </div>
        </template>
        <template v-if="lgModal.content==='SystemSetting'">systemSetting</template>
        <template v-if="lgModal.content==='CheckLocalStatus'">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>文件名</th>
                <th>路径</th>
                <th>创建时间(本地)</th>
                <th>更新时间(本地))</th>
                <th>创建时间(云端)</th>
                <th>更新时间(云端)</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in lgModal.data" :key="index">
                <td>{{ item.name }}</td>
                <td>{{ item.path }}</td>
                <td>{{ item.created_at_l }}</td>
                <td>{{ item.updated_at_l }}</td>
                <td>{{ item.created_at_c }}</td>
                <td>{{ item.updated_at_c }}</td>
                <td>
                  <div class="btn-group btn-group-block">
                    <button class="btn" @click="checkLocalOperate('keepLocal', index)">保留本地</button>
                    <button class="btn" @click="checkLocalOperate('keepCloud', index)">保留云端</button>
                    <button class="btn" @click="checkLocalOperate('notOpe', index)">不操作</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-if="lgModal.content==='GitInitClone'">
          <div class="form-horizontal">
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Repo地址</label>
              </div>
              <div class="col-9 col-sm-12">
                <input class="form-input" type="url" v-model="lgModal.data.repo" required />
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">文件夹名</label>
              </div>
              <div class="col-9 col-sm-12 has-icon-right">
                <input
                  :class="'form-input' + (lgModal.data.status === 'error' ? ' is-error' : '')"
                  type="text"
                  v-model="lgModal.data.foldername"
                  required
                />
                <i
                  :class="'form-icon icon' + (lgModal.data.status === 'loading' ? ' loading' : '')"
                ></i>
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Init/Clone</label>
              </div>
              <div class="col-9 col-sm-12">
                <select class="form-select" v-model="lgModal.data.init_or_clone" required>
                  <option value="init">Init</option>
                  <option value="clone">Clone</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Git用户名</label>
              </div>
              <div class="col-9 col-sm-12">
                <input
                  class="form-input"
                  type="text"
                  v-model="lgModal.data.git_name"
                  placeholder="若不填写则使用全局默认的配置"
                />
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Git邮箱</label>
              </div>
              <div class="col-9 col-sm-12">
                <input
                  class="form-input"
                  type="email"
                  v-model="lgModal.data.git_email"
                  placeholder="若不填写则使用全局默认的配置"
                />
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Git密码</label>
              </div>
              <div class="col-9 col-sm-12">
                <input
                  class="form-input"
                  type="password"
                  v-model="lgModal.data.git_password"
                  placeholder="若不填写则使用全局默认的配置"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-if="lgModal.content==='GitItemConfig'">
          <div class="form-horizontal">
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Repo地址</label>
              </div>
              <div class="col-9 col-sm-12 has-icon-right">
                <input class="form-input" type="url" v-model="lgModal.data.repo" required />
                <i
                  :class="'form-icon icon' + (lgModal.data.status === 'loading' ? ' loading' : '')"
                ></i>
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Git用户名</label>
              </div>
              <div class="col-9 col-sm-12 has-icon-right">
                <input class="form-input" type="text" v-model="lgModal.data.git_name" required />
                <i
                  :class="'form-icon icon' + (lgModal.data.status === 'loading' ? ' loading' : '')"
                ></i>
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Git邮箱</label>
              </div>
              <div class="col-9 col-sm-12 has-icon-right">
                <input class="form-input" type="email" v-model="lgModal.data.git_email" required />
                <i
                  :class="'form-icon icon' + (lgModal.data.status === 'loading' ? ' loading' : '')"
                ></i>
              </div>
            </div>
            <div class="form-group">
              <div class="col-3 col-sm-12">
                <label class="form-label">Git密码</label>
              </div>
              <div class="col-9 col-sm-12">
                <input
                  class="form-input"
                  type="password"
                  v-model="lgModal.data.git_password"
                  required
                />
              </div>
            </div>
          </div>
        </template>
      </modal>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import XK_Editor from "xkeditor";
import onlyFolderItem from "./onlyFolderItem";
import noteItem from "./noteItem";
import folderItem from "./folderItem";
import dropdown from "./dropdown";
import modal from "./modal";
import iSettingList from "../utils/settingList";
import dropdownList from "../utils/dropdownList";
export default {
  name: "home",
  components: {
    "xk-editor": XK_Editor,
    "only-folder-item": onlyFolderItem,
    "note-item": noteItem,
    "folder-item": folderItem,
    dropdown,
    modal
  },
  props: [
    "loadFirstNote",
    "setXknoteOpened",
    "openNote",
    "writeMode",
    "configOperate",
    "listOperate"
  ],
  data() {
    return {
      settingList: iSettingList,
      navBarListC: dropdownList.navBarListC,
      navBarListR: dropdownList.navBarListR,
      showSidebar: false, // 该属性只有在writeMode有用
      loadedEditor: false,
      floatMenu: {
        show: false,
        items: [],
        data: {},
        saveAndClose: true
      }
    };
  },
  computed: {
    ...mapGetters("note", ["getReData"]),
    ...mapState("note", [
      "noteBaseInfo",
      "xknoteOpened",
      "xknoteOpenedIndex",
      "currListSource",
      "currList",
      "cloudList",
      "localList",
      "xknoteTab",
      "readOpened",
      "currBadgeCount",
      "localBadgeCount"
    ]),
    ...mapState("tools", ["smModal", "lgModal"])
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
    ...mapActions("tools", [
      "showSmModal",
      "hideSmModal",
      "showLgModal",
      "hideLgModal",
      "setLgModalData",
      "delLgModalData"
    ]),
    logout() {
      window.axios.post("/logout").then(function() {
        window.location.href = "/";
      });
    },
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
        // await this.loadCloudFolders();
        this.$nextTick(() => {
          this.loadFirstNote();
          this.loadedEditor = true;
          if (this.writeMode) {
            this.switchWriteMode();
          }
        });
      }
    },
    /**
     * 操作列表
     * @param {string} operate 操作名称
     * @param {string} storage 要操作对象存储的位置
     * @param {string} path 要操作对象的索引
     * @param {object=} curr 当前操作的item的dom对象
     * @returns void
     */
    menuOperate(operate, type, storage, path, curr = null) {
      this.floatMenu.show = false;
      if (operate === "delete") {
        this.showSmModal({
          title: "删除",
          content: "是否删除该文件(文件夹)？(此操作不可逆)",
          confirm: () => {
            let info = this.listOperate({
              operate: "get",
              storage: storage,
              path: path
            });
            if (type === "note") {
              this.noteOperate({
                operate: operate,
                storage: storage,
                noteInfo: info
              })
                .then(res => {
                  this.listOperate({
                    operate: "delete",
                    storage: storage,
                    path: path
                  });
                  this.timeToast({
                    message: "删除成功！",
                    status: "success",
                    delay: 1000
                  });
                })
                .catch(err => {
                  this.timeToast({
                    message: "删除失败！请重试。",
                    status: "error",
                    delay: 1000
                  });
                });
            } else {
              this.folderOperate({ operate: operate, noteInfo: info })
                .then(res => {
                  this.listOperate({
                    operate: "delete",
                    storage: storage,
                    path: path
                  });
                })
                .then(() => {
                  this.timeToast({
                    message: "删除成功！",
                    status: "success",
                    delay: 1000
                  });
                })
                .catch(err => {
                  this.timeToast({
                    message: "删除失败！请重试。",
                    status: "error",
                    delay: 1000
                  });
                });
            }
            this.hideSmModal();
          },
          cancel: () => {
            this.hideSmModal();
          }
        });
      }
      if (operate === "rename") {
        // 先获取到旧的Note信息，为了防止对象的变动所以需要克隆对象，利用json转换即可方便克隆对象
        let info = this.listOperate({
          operate: "get",
          storage: storage,
          path: path
        });
        let oldInfo = JSON.parse(JSON.stringify(info));
        // 更改item为输入框
        let input = null;
        if (type === "note") {
          curr.querySelector(".tile-content").setAttribute("children", "input");
          input = curr.querySelector(".tile-content > input");
        } else {
          curr
            .querySelector(".accordion-header")
            .setAttribute("children", "input");
          input = curr.querySelector(".accordion-header > input");
        }
        let keyEv = e => {
          if (e.key === "Enter") {
            let value = e.target.value;
            let newPath = info.path.replace(new RegExp(info.name + "$"), value);
            this.listOperate({
              operate: "add",
              storage: storage,
              path: newPath,
              noteInfo: {
                note: info,
                source: {
                  path: newPath,
                  storage: this.currListSource[info.path].storage
                }
              }
            });
            this.listOperate({
              operate: "delete",
              storage: storage,
              path: info.path
            });
            // TODO: 修复
            info.path = newPath;
            info.name = value;
            input.setAttribute("disabled", "disabled");
            if (type === "note") {
              let s = storage;
              if (storage === "curr") {
                s = this.currListSource[newPath].storage;
              }
              this.noteOperate({
                operate: operate,
                storage: s,
                noteInfo: {
                  oldNote: oldInfo,
                  note: info
                }
              })
                .then(res => {
                  curr
                    .querySelector(".tile-content")
                    .removeAttribute("children");
                  input.removeEventListener("keydown", keyEv);
                  input.removeAttribute("disabled");
                  this.timeToast({
                    message: "重命名成功！",
                    status: "success",
                    delay: 1000
                  });
                })
                .catch(err => {
                  info.path = oldInfo.path;
                  info.name = oldInfo.name;
                  input.removeAttribute("disabled");
                  this.timeToast({
                    message: "重命名失败！请重试。",
                    status: "error",
                    delay: 1000
                  });
                });
            } else {
              this.folderOperate({
                operate: operate,
                folderInfo: {
                  oldFolder: oldInfo,
                  folder: info
                }
              })
                .then(res => {
                  curr
                    .querySelector(".accordion-header")
                    .removeAttribute("children");
                  input.removeEventListener("keydown", keyEv);
                  input.removeAttribute("disabled");
                  this.timeToast({
                    message: "重命名成功！",
                    status: "success",
                    delay: 1000
                  });
                })
                .catch(err => {
                  info.path = oldInfo.path;
                  info.name = oldInfo.name;
                  input.removeAttribute("disabled");
                  this.timeToast({
                    message: "重命名失败！请重试。",
                    status: "error",
                    delay: 1000
                  });
                });
            }
          }
        };
        input.addEventListener("keydown", keyEv);
      }
      // noteItem专有操作
      if (type === "note") {
        if (operate === "saveLocal") {
          let note = this.listOperate({
            operate: "get",
            storage: storage,
            path: path
          });
          // Path相同的时候视为同一文档，但保存时并未删除，所以需要调整判断
          this.listOperate({
            operate: "delete",
            storage: "local",
            path: path
          });
          if (storage === "curr") {
            if (note.status != "C") {
              note.status = "L";
            }
            // 保存到本地（实际操作）
            this.noteOperate({
              operate: "save",
              storage: "local",
              noteInfo: note
            })
              .then(() => {
                if (this.floatMenu.saveAndClose) {
                  note = this.listOperate({
                    operate: "delete",
                    storage: "curr",
                    path: path
                  });
                  this.setXknoteOpened(
                    JSON.parse(JSON.stringify(this.noteBaseInfo))
                  );
                }
                let localIndex = this.listOperate({
                  operate: "add",
                  storage: "local",
                  path: path,
                  noteInfo: note
                });
                // 若不是从localList中打开的文件就不会有currListSource的信息，如果用户选择不关闭保存，则需要添加source信息，防止后续操作出现问题
                if (!this.floatMenu.saveAndClose) {
                  this.setCurrListSourceA({
                    path: path,
                    source: {
                      path: localIndex,
                      storage: "local"
                    }
                  });
                }
                this.timeToast({
                  message: "保存到本地成功！",
                  status: "success",
                  delay: 1000
                });
              })
              .catch(err => {
                this.timeToast({
                  message: "保存到本地失败！",
                  status: "error",
                  delay: 1000
                });
              });
          }
          if (storage === "cloud") {
            let noteEle = document.querySelector(
              '[data-path="' + path + '"][data-storage="cloud"]'
            );
            let icon = noteEle.querySelector(".tile-action");
            icon.style.display = "unset";
            let btn = icon.querySelector(".btn");
            this.noteOperate({
              operate: "read",
              storage: "cloud",
              noteInfo: note
            })
              .then(data => {
                this.$set(note, "note", data.note);
                note.status = "C";
                btn.querySelector(".loading").style.display = "none";
                icon.style.display = "";
                this.noteOperate({
                  operate: "save",
                  storage: "local",
                  noteInfo: note
                })
                  .then(() => {
                    this.listOperate({
                      operate: "add",
                      storage: "local",
                      path: path,
                      noteInfo: note
                    });
                    this.timeToast({
                      message: "保存到本地成功！",
                      status: "success",
                      delay: 1000
                    });
                  })
                  .catch(err => {
                    this.timeToast({
                      message: "保存到本地失败！请重试。",
                      status: "error",
                      delay: 1000
                    });
                  });
              })
              .catch(err => {
                this.timeToast({
                  message: "加载失败！请重试。",
                  status: "error",
                  delay: 1000
                });
              });
          }
        }
        if (operate === "saveCloud") {
          let note = this.listOperate({
            operate: "get",
            storage: storage,
            path: path
          });
          this.noteOperate({
            operate: "save",
            storage: "cloud",
            noteInfo: note
          })
            .then(() => {
              note.status = "C";
              if (storage === "curr") {
                if (this.currListSource[path].storage === "local") {
                  this.noteOperate({
                    operate: "save",
                    storage: "local",
                    noteInfo: note
                  });
                }
                if (this.floatMenu.saveAndClose) {
                  this.listOperate({
                    operate: "delete",
                    storage: "curr",
                    path: path
                  });
                  this.setXknoteOpened(
                    JSON.parse(JSON.stringify(this.noteBaseInfo))
                  );
                }
              }
              if (storage === "local") {
                if (this.floatMenu.saveAndClose) {
                  this.noteOperate({
                    operate: "delete",
                    storage: "local",
                    noteInfo: note
                  });
                  this.listOperate({
                    operate: "delete",
                    storage: storage,
                    path: path
                  });
                } else {
                  this.noteOperate({
                    operate: "save",
                    storage: "local",
                    noteInfo: note
                  });
                }
              }
              this.listOperate({
                operate: "add",
                storage: "cloud",
                path: path,
                noteInfo: note
              });
              this.timeToast({
                message: "保存到云端成功！",
                status: "success",
                delay: 1000
              });
            })
            .catch(err => {
              this.timeToast({
                message: "保存到云端失败！请重试。",
                status: "error",
                delay: 1000
              });
            });
        }
        if (operate === "closeCurr") {
          // 如果笔记在未保存状态关闭则先弹出modal提示是否下关闭
          let closeCurr = () => {
            if (path == this.xknoteOpenedIndex.curr) {
              this.setXknoteOpened(
                JSON.parse(JSON.stringify(this.noteBaseInfo))
              );
            }
            this.listOperate({
              operate: "delete",
              storage: "curr",
              path: path
            });
          };
          if (
            this.listOperate({ operate: "get", storage: storage, path: path })
              .status === "N"
          ) {
            this.showSmModal({
              title: "关闭",
              content: "该文件未保存，是否关闭该文件？(此操作不可逆)",
              confirm: () => {
                closeCurr();
                this.hideSmModal();
              },
              cancel: () => {
                this.hideSmModal();
              }
            });
          } else {
            closeCurr();
          }
        }
      }
      // folderItem专有操作
      if (type === "folder") {
        if (operate.indexOf("git") === 0) {
          this.gitOperate(operate, path);
        }
      }
    },
    /**
     * 浮动菜单选项点击事件
     * @param {string} operate 操作名称
     * @returns void
     */
    floatMenuOperate(operate) {
      this.menuOperate(
        operate,
        this.floatMenu.data.type,
        this.floatMenu.data.storage,
        this.floatMenu.data.path,
        this.floatMenu.data.currEle
      );
    },
    /**
     * header菜单选项点击事件
     * @param {string} operate 操作名称
     * @returns void
     */
    navBarOperate(operate) {
      if (operate.indexOf("show") === 0) {
        let modal = {};
        modal.content = operate.substring(4);
        if (modal.content === "CreateNote") {
          modal.title = "新建MD笔记";
          let wTimeout = null;
          let watch = () => {
            if (wTimeout) {
              clearTimeout(wTimeout);
            }
            wTimeout = setTimeout(() => {
              this.setLgModalData({
                ...this.lgModal.data,
                status: "loading"
              });
              // TODO: 设置格式
              if (!/\.(md|txt)/gi.test(this.lgModal.data.filename)) {
                this.setLgModalData({
                  ...this.lgModal.data,
                  status: "error"
                });
                return;
              }
              this.noteOperate({
                operate: "exist",
                storage: this.lgModal.data.storage,
                noteInfo: {
                  path:
                    this.lgModal.data.select + "/" + this.lgModal.data.filename
                }
              }).then(data => {
                if (data.exist) {
                  this.setLgModalData({
                    ...this.lgModal.data,
                    status: "error"
                  });
                } else {
                  this.setLgModalData({
                    ...this.lgModal.data,
                    status: ""
                  });
                }
              });
            }, 500);
          };
          let uwFileName = this.$watch("lgModal.data.filename", watch);
          let uwTitle = this.$watch("lgModal.data.select", watch);
          let uwStorage = this.$watch("lgModal.data.storage", watch);
          modal.confirm = () => {
            if (
              !this.lgModal.data.filename ||
              !this.lgModal.data.title ||
              !this.lgModal.data.storage ||
              this.lgModal.data.status !== ""
            ) {
              return;
            }
            document
              .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
              .classList.add("loading");
            let d = new Date();
            let date =
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
            let path =
              this.lgModal.data.select + "/" + this.lgModal.data.filename;
            let noteInfo = {
              type: "note",
              path: path,
              name: this.lgModal.data.filename,
              status: "N",
              note: {
                title: this.lgModal.data.title,
                created_at: date,
                updated_at: date,
                author: "",
                content: ""
              }
            };
            this.openNote(
              noteInfo,
              {
                path: path,
                storage: this.lgModal.data.storage
              },
              "normal",
              true
            );
            this.listOperate({
              operate: "add",
              storage: this.lgModal.data.storage,
              path: path,
              noteInfo: noteInfo
            });
            document
              .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
              .classList.remove("loading");
            this.lgModal.cancel();
          };
          modal.cancel = () => {
            uwFileName();
            uwTitle();
            uwStorage();
            this.hideLgModal();
          };
          this.folderOperate({ operate: "readOnly", folderInfo: null }).then(
            data => {
              this.setLgModalData({
                ...this.lgModal.data,
                folders: data.folders
              });
            }
          );
          this.showLgModal(modal);
        }
        if (modal.content === "CreateFolder") {
          modal.title = "新建文件夹";
          let wTimeout = null;
          let watch = () => {
            if (wTimeout) {
              clearTimeout(wTimeout);
            }
            wTimeout = setTimeout(() => {
              this.setLgModalData({
                ...this.lgModal.data,
                status: "loading"
              });
              this.folderOperate({
                operate: "exist",
                folderInfo: {
                  path:
                    this.lgModal.data.select +
                    "/" +
                    this.lgModal.data.foldername
                }
              }).then(data => {
                if (data.exist) {
                  this.setLgModalData({
                    ...this.lgModal.data,
                    status: "error"
                  });
                } else {
                  this.setLgModalData({
                    ...this.lgModal.data,
                    status: ""
                  });
                }
              });
            }, 500);
          };
          let uwFolderName = this.$watch("lgModal.data.foldername", watch);
          let uwTitle = this.$watch("lgModal.data.select", watch);
          modal.confirm = () => {
            if (
              !this.lgModal.data.foldername ||
              this.lgModal.data.status !== ""
            ) {
              return;
            }
            document
              .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
              .classList.add("loading");
            let path =
              this.lgModal.data.select + "/" + this.lgModal.data.foldername;
            this.folderOperate({
              operate: "create",
              folderInfo: {
                path: path
              }
            })
              .then(() => {
                this.listOperate({
                  operate: "add",
                  storage: this.lgModal.data.storage,
                  path: path
                });
                document
                  .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
                  .classList.remove("loading");
                this.lgModal.cancel();
                this.loadCloudFolders();
                this.timeToast({
                  message: "创建文件夹成功！",
                  status: "success",
                  delay: 1000
                });
              })
              .catch(err => {
                this.timeToast({
                  message: "创建文件夹失败！请重试。",
                  status: "error",
                  delay: 1000
                });
              });
          };
          modal.cancel = () => {
            uwFolderName();
            uwTitle();
            this.hideLgModal();
          };
          this.folderOperate({ operate: "readOnly", folderInfo: null }).then(
            data => {
              this.setLgModalData({
                ...this.lgModal.data,
                folders: data.folders
              });
            }
          );
          this.showLgModal(modal);
        }
        if (modal.content === "GitConfig") {
          modal.title = "Git设置";
          this.setLgModalData({
            ...this.lgModal.data,
            status: "loading"
          });
          this.configOperate(
            "getGitConfig",
            null,
            info => {
              this.setLgModalData({
                ...this.lgModal.data,
                status: "",
                git_name: info.git_name,
                git_email: info.git_email
              });
            },
            error => {
              this.timeToast({
                message: "获取信息失败！",
                status: "error",
                delay: 1000
              });
              this.setLgModalData({
                ...this.lgModal.data,
                status: ""
              });
            }
          );
          modal.confirm = () => {
            if (
              !this.lgModal.data.git_name ||
              !this.lgModal.data.git_email ||
              !this.lgModal.data.git_password ||
              this.lgModal.data.status !== ""
            ) {
              return;
            }
            document
              .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
              .classList.add("loading");
            this.configOperate(
              "setGitConfig",
              {
                git_name: this.lgModal.data.git_name,
                git_email: this.lgModal.data.git_email,
                git_password: this.lgModal.data.git_password
              },
              () => {
                document
                  .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
                  .classList.remove("loading");
                this.lgModal.cancel();
                this.timeToast({
                  message: "设置成功！",
                  status: "success",
                  delay: 1000
                });
              },
              error => {
                this.timeToast({
                  message: "设置失败，请重试！",
                  status: "error",
                  delay: 1000
                });
              }
            );
          };
          modal.cancel = () => {
            this.hideLgModal();
          };
          this.showLgModal(modal);
        }
      }
      if (operate.indexOf("git") === 0) {
        let path = this.xknoteOpened.path;
        this.gitOperate(operate, path.substring(0, path.indexOf("/", 1)));
      }
      if (operate === "saveLocal" || operate === "saveCloud") {
        this.floatMenu.saveAndClose = false;
        this.menuOperate(operate, "note", "curr", this.xknoteOpenedIndex.curr);
      }
      if (operate === "saveAllLocal" || operate === "saveAllCloud") {
        this.floatMenu.saveAndClose = false;
        for (let key in this.currList) {
          this.menuOperate(operate.replace("All", ""), "note", "curr", key);
        }
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
      if (operate === "logout") {
        this.logout();
      }
    },
    checkLocalStatus() {
      document.querySelector(".xknote-check-local").classList.add("loading");
      window.axios
        .post("/api/notes/check", {
          check_list: Object.keys(this.localList)
        })
        .then(res => {
          let data = {};
          for (let key in this.localList) {
            data[this.localList[key].path] = {
              name: this.localList[key].name,
              path: this.localList[key].path,
              created_at_l: this.localList[key].note.created_at,
              updated_at_l: this.localList[key].note.updated_at,
              created_at_c: res.data.check_list[key].created_at,
              updated_at_c: res.data.check_list[key].updated_at
            };
          }
          this.setLgModalData(data);
          this.showLgModal({
            title: "检查状态",
            content: "CheckLocalStatus",
            confirm: () => {
              this.hideLgModal();
            },
            cancel: () => {
              this.hideLgModal();
            }
          });
          document
            .querySelector(".xknote-check-local")
            .classList.remove("loading");
        });
    },
    checkLocalOperate(operate, index) {
      let path = this.lgModal.data[index].path;
      if (operate === "keepLocal") {
        this.noteOperate({
          operate: "read",
          storage: "local",
          noteInfo: { path: path }
        }).then(data => {
          this.noteOperate({
            operate: "save",
            storage: "cloud",
            noteInfo: data
          }).then(() => {
            this.localList[path].status = "C";
            //TODO: 修改使用action修改
            // this.$delete(this.lgModal.data, index);
            this.delLgModalData(index);
            // 将更新后的状态保存到本地
            this.noteOperate({
              operate: "save",
              storage: "local",
              noteInfo: this.localList[path]
            });
          });
        });
      }
      if (operate === "keepCloud") {
        this.noteOperate({
          operate: "read",
          storage: "cloud",
          noteInfo: { path: path }
        }).then(data => {
          this.noteOperate({
            operate: "save",
            storage: "local",
            noteInfo: data
          }).then(() => {
            this.localList[path].status = "C";
            // this.$delete(this.lgModal.data, index);
            this.delLgModalData(index);
          });
        });
      }
      if (operate === "notOpe") {
        this.$delete(this.lgModal.data, index);
      }
    },
    gitOperate(operate, path) {
      if (operate === "gitPull") {
        this.folderOperate({ operate: operate, folderInfo: { path: path } })
          .then(() => {
            this.timeToast({
              message: "Git Pull成功！",
              status: "success",
              delay: 1000
            });
          })
          .catch(error => {
            this.timeToast({
              message: "Git Pull失败，请重试！",
              status: "error",
              delay: 1000
            });
          });
      }
      if (operate === "gitPush") {
        this.folderOperate({ operate: operate, folderInfo: { path: path } })
          .then(() => {
            this.timeToast({
              message: "Git Push成功！",
              status: "success",
              delay: 1000
            });
          })
          .catch(error => {
            this.timeToast({
              message: "Git Push失败，请重试！",
              status: "error",
              delay: 1000
            });
          });
      }
      if (operate === "gitPushForce") {
        this.folderOperate({ operate: operate, folderInfo: { path: path } })
          .then(() => {
            this.timeToast({
              message: "Git Push成功！",
              status: "success",
              delay: 1000
            });
          })
          .catch(error => {
            this.timeToast({
              message: "Git Push失败，请重试！",
              status: "error",
              delay: 1000
            });
          });
      }
      if (operate === "gitInitClone") {
        let modal = {};
        modal.content = "GitInitClone";
        modal.title = "Git InitClone";
        let wTimeout = null;
        let watch = () => {
          if (wTimeout) {
            clearTimeout(wTimeout);
          }
          wTimeout = setTimeout(() => {
            this.setLgModalData({
              ...this.lgModal.data,
              status: "loading"
            });
            this.folderOperate({
              operate: "exist",
              folderInfo: {
                path: this.lgModal.data.foldername + "/.git"
              }
            }).then(data => {
              if (data.exist) {
                this.setLgModalData({
                  ...this.lgModal.data,
                  status: "error"
                });
              } else {
                this.setLgModalData({
                  ...this.lgModal.data,
                  status: ""
                });
              }
            });
          }, 500);
        };
        let uwFolderName = this.$watch("lgModal.data.foldername", watch);
        modal.confirm = () => {
          if (
            !this.lgModal.data.foldername ||
            !this.lgModal.data.repo ||
            !this.lgModal.data.init_or_clone ||
            this.lgModal.data.status !== ""
          ) {
            return;
          }
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.add("loading");
          let git_user = {};
          if (
            this.lgModal.data.git_name &&
            this.lgModal.data.git_email &&
            this.lgModal.data.git_password
          ) {
            git_user = {
              git_name: this.lgModal.data.git_name,
              git_email: this.lgModal.data.git_email,
              git_password: this.lgModal.data.git_password
            };
          }
          this.folderOperate({
            operate:
              this.lgModal.data.init_or_clone === "init"
                ? "gitInit"
                : "gitClone",
            folderInfo: {
              path: this.lgModal.data.foldername,
              repo: this.lgModal.data.repo,
              git_user: git_user
            }
          }).then(() => {
            document
              .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
              .classList.remove("loading");
            this.lgModal.cancel();
            this.timeToast({
              message: "Git Init或Clone成功！",
              status: "success",
              delay: 1000
            });
          });
        };
        modal.cancel = () => {
          uwFolderName();
          this.hideLgModal();
        };
        this.showLgModal(modal);
      }
      if (operate === "gitConfig") {
        let modal = {};
        modal.title = "Git设置";
        modal.content = "GitItemConfig";
        this.setLgModalData({
          ...this.lgModal.data,
          status: "loading"
        });
        this.folderOperate({
          operate: "getGitConfig",
          folderInfo: { path: path }
        })
          .then(info => {
            this.setLgModalData({
              ...this.lgModal.data,
              status: "",
              repo: info.repo,
              git_name: info.git_name,
              git_email: info.git_email
            });
          })
          .catch(error => {
            this.timeToast({
              message: "获取信息失败！",
              status: "error",
              delay: 1000
            });
            this.setLgModalData({
              ...this.lgModal.data,
              status: ""
            });
          });
        modal.confirm = () => {
          if (
            !this.lgModal.data.git_name ||
            !this.lgModal.data.git_email ||
            !this.lgModal.data.git_password ||
            this.lgModal.data.status !== ""
          ) {
            return;
          }
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.add("loading");
          this.folderOperate({
            operate: "setGitConfig",
            folderInfo: {
              repo: this.lgModal.data.repo,
              git_name: this.lgModal.data.git_name,
              git_email: this.lgModal.data.git_email,
              git_password: this.lgModal.data.git_password,
              path: path
            }
          })
            .then(() => {
              document
                .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
                .classList.remove("loading");
              this.lgModal.cancel();
              this.timeToast({
                message: "设置成功！",
                status: "success",
                delay: 1000
              });
            })
            .catch(error => {
              this.timeToast({
                message: "设置失败，请重试！",
                status: "error",
                delay: 1000
              });
            });
        };
        modal.cancel = () => {
          this.hideLgModal();
        };
        this.showLgModal(modal);
      }
    }
  },
  mounted() {
    window.timeToast = this.timeToast;
  },
  watch: {
    writeMode() {
      this.switchWriteMode();
    }
  }
};
</script>

<style>
.active {
  color: #585858;
}
#toc li img {
  width: 1.05em;
}
</style>
