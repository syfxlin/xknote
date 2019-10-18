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
              <a @click="logout">登出</a>
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
      <div :class="'modal xknote-lg-modal' + (lgModal.show ? ' active' : '')">
        <a class="modal-overlay"></a>
        <div :class="'modal-container ' + lgModal.content" role="document">
          <div class="modal-header">
            <a class="btn btn-clear float-right" @click="lgModal.cancel()"></a>
            <div class="modal-title h5">{{ lgModal.title }}</div>
          </div>
          <div class="modal-body">
            <div class="content">
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
              <template v-if="lgModal.content==='UserSetting'">userSetting</template>
              <template v-if="lgModal.content==='GitSetting'">gitSetting</template>
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
import onlyFolderItem from "./onlyFolderItem";
export default {
  name: "home",
  components: {
    "xk-editor": XK_Editor,
    "note-item": noteItem,
    "folder-item": folderItem,
    "only-folder-item": onlyFolderItem
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
    "folderOperate",
    "setXknoteOpened",
    "openNote",
    "writeMode",
    "loadCloudFolders"
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
        data: {},
        confirm: () => {},
        cancel: () => {
          this.smModal.show = false;
        }
      },
      lgModal: {
        show: false,
        title: "",
        content: "",
        data: {},
        confirm: () => {},
        cancel: () => {
          this.lgModal.show = false;
        }
      },
      floatMenu: {
        show: false,
        items: [],
        data: {},
        saveAndClose: true
      }
    };
  },
  computed: {
    // 计算在Tab bar上的计数
    currBadgeCount() {
      let count = 0;
      for (let key in this.currList) {
        if (this.currList[key].status === "N") {
          count++;
        }
      }
      return count;
    },
    localBadgeCount() {
      let count = 0;
      for (let key in this.localList) {
        if (this.localList[key].status === "N") {
          count++;
        }
      }
      return count;
    }
  },
  methods: {
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
     * @param {string} path 要操作对象的索引
     * @param {object=} curr 当前操作的item的dom对象
     * @returns void
     */
    menuOperate(operate, type, storage, path, curr = null) {
      this.floatMenu.show = false;
      if (operate === "delete") {
        this.smModal.title = "删除";
        this.smModal.content = "是否删除该文件(文件夹)？(此操作不可逆)";
        this.smModal.show = true;
        this.smModal.confirm = () => {
          this.smModal.show = false;
          let info = this.listOperate("get", storage, path);
          if (type === "note") {
            this.noteOperate(operate, storage, info, res => {
              this.listOperate("delete", storage, path);
            });
          } else {
            this.folderOperate(operate, info, res => {
              this.listOperate("delete", storage, path);
            });
          }
        };
        this.smModal.cancel = () => {
          this.smModal.show = false;
        };
      }
      if (operate === "rename") {
        // 先获取到旧的Note信息，为了防止对象的变动所以需要克隆对象，利用json转换即可方便克隆对象
        let info = this.listOperate("get", storage, path);
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
            this.listOperate(
              "add",
              storage,
              newPath,
              this.listOperate("delete", storage, info.path)
            );
            info.path = newPath;
            info.name = value;
            input.setAttribute("disabled", "disabled");
            if (type === "note") {
              let s = storage;
              if (storage === "curr") {
                s = this.currListSource[path].storage;
              }
              this.noteOperate(
                operate,
                s,
                {
                  oldNote: oldInfo,
                  note: info
                },
                res => {
                  curr
                    .querySelector(".tile-content")
                    .removeAttribute("children");
                  input.removeEventListener("keydown", keyEv);
                  input.removeAttribute("disabled");
                },
                err => {
                  info.path = oldInfo.path;
                  info.name = oldInfo.name;
                  input.removeAttribute("disabled");
                }
              );
            } else {
              this.folderOperate(
                operate,
                {
                  oldFolder: oldInfo,
                  folder: info
                },
                res => {
                  curr
                    .querySelector(".accordion-header")
                    .removeAttribute("children");
                  input.removeEventListener("keydown", keyEv);
                  input.removeAttribute("disabled");
                },
                err => {
                  info.path = oldInfo.path;
                  info.name = oldInfo.name;
                  input.removeAttribute("disabled");
                }
              );
            }
          }
        };
        input.addEventListener("keydown", keyEv);
      }
      // noteItem专有操作
      if (type === "note") {
        if (operate === "saveLocal") {
          let note = this.listOperate("get", storage, path);
          // Path相同的时候视为同一文档，但保存时并未删除，所以需要调整判断
          this.listOperate("delete", "local", path);
          if (storage === "curr") {
            if (note.status != "C") {
              note.status = "L";
            }
            // 保存到本地（实际操作）
            this.noteOperate("save", "local", note, () => {
              if (this.floatMenu.saveAndClose) {
                note = this.listOperate("delete", "curr", path);
                this.setXknoteOpened(
                  JSON.parse(JSON.stringify(this.noteBaseInfo))
                );
              }
              let localIndex = this.listOperate("add", "local", path, note);
              // 若不是从localList中打开的文件就不会有currListSource的信息，如果用户选择不关闭保存，则需要添加source信息，防止后续操作出现问题
              if (!this.floatMenu.saveAndClose) {
                this.currListSource[path] = {
                  path: localIndex,
                  storage: "local"
                };
                // this.$emit("update:currListSource", this.currListSource);
              }
            });
          }
          if (storage === "cloud") {
            let noteEle = document.querySelector(
              '[data-path="' + path + '"][data-storage="cloud"]'
            );
            let icon = noteEle.querySelector(".tile-action");
            icon.style.display = "unset";
            let btn = icon.querySelector(".btn");
            this.noteOperate("read", "cloud", note, data => {
              this.$set(note, "note", data.note);
              note.status = "C";
              btn.querySelector(".loading").style.display = "none";
              icon.style.display = "";
              this.noteOperate("save", "local", note, () => {
                this.listOperate("add", "local", path, note);
              });
            });
          }
        }
        if (operate === "saveCloud") {
          let note = this.listOperate("get", storage, path);
          this.noteOperate("save", "cloud", note, () => {
            note.status = "C";
            if (storage === "curr") {
              if (this.currListSource[path].storage === "local") {
                this.noteOperate("save", "local", note);
              }
              if (this.floatMenu.saveAndClose) {
                note = this.listOperate("delete", "curr", path);
                this.setXknoteOpened(
                  JSON.parse(JSON.stringify(this.noteBaseInfo))
                );
              }
            }
            if (storage === "local") {
              if (this.floatMenu.saveAndClose) {
                this.noteOperate("delete", "local", note);
                this.listOperate("delete", storage, path);
              } else {
                this.noteOperate("save", "local", note);
              }
            }
            this.listOperate("add", "cloud", path, note);
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
            this.listOperate("delete", "curr", path);
          };
          if (this.listOperate("get", storage, path).status === "N") {
            this.smModal.title = "关闭";
            this.smModal.content =
              "该文件未保存，是否关闭该文件？(此操作不可逆)";
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
      }
      // folderItem专有操作
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
        this.lgModal.show = true;
        this.lgModal.content = operate.substring(4);
        if (this.lgModal.content === "CreateNote") {
          this.lgModal.title = "新建MD笔记";
          this.folderOperate("readOnly", null, data => {
            this.$set(this.lgModal.data, "folders", data.folders);
          });
          let wTimeout = null;
          let watch = () => {
            if (wTimeout) {
              clearTimeout(wTimeout);
            }
            wTimeout = setTimeout(() => {
              this.$set(this.lgModal.data, "status", "loading");
              // TODO: 设置格式
              if (!/\.(md|txt)/gi.test(this.lgModal.data.filename)) {
                this.$set(this.lgModal.data, "status", "error");
                return;
              }
              this.noteOperate(
                "exist",
                this.lgModal.data.storage,
                {
                  path:
                    this.lgModal.data.select + "/" + this.lgModal.data.filename
                },
                data => {
                  if (data.exist) {
                    this.$set(this.lgModal.data, "status", "error");
                  } else {
                    this.$set(this.lgModal.data, "status", "");
                  }
                }
              );
            }, 500);
          };
          let uwFileName = this.$watch("lgModal.data.filename", watch);
          let uwTitle = this.$watch("lgModal.data.select", watch);
          let uwStorage = this.$watch("lgModal.data.storage", watch);
          this.lgModal.confirm = () => {
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
            this.listOperate("add", this.lgModal.data.storage, path, noteInfo);
            document
              .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
              .classList.remove("loading");
            this.lgModal.cancel();
          };
          this.lgModal.cancel = () => {
            uwFileName();
            uwTitle();
            uwStorage();
            this.$set(this.lgModal, "data", {});
            this.lgModal.show = false;
          };
        }
        if (this.lgModal.content === "CreateFolder") {
          this.lgModal.title = "新建文件夹";
          this.folderOperate("readOnly", null, data => {
            this.$set(this.lgModal.data, "folders", data.folders);
          });
          let wTimeout = null;
          let watch = () => {
            if (wTimeout) {
              clearTimeout(wTimeout);
            }
            wTimeout = setTimeout(() => {
              this.$set(this.lgModal.data, "status", "loading");
              this.folderOperate(
                "exist",
                {
                  path:
                    this.lgModal.data.select +
                    "/" +
                    this.lgModal.data.foldername
                },
                data => {
                  if (data.exist) {
                    this.$set(this.lgModal.data, "status", "error");
                  } else {
                    this.$set(this.lgModal.data, "status", "");
                  }
                }
              );
            }, 500);
          };
          let uwFolderName = this.$watch("lgModal.data.foldername", watch);
          let uwTitle = this.$watch("lgModal.data.select", watch);
          this.lgModal.confirm = () => {
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
            this.folderOperate(
              "create",
              {
                path: path
              },
              () => {
                this.listOperate("add", this.lgModal.data.storage, path);
                document
                  .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
                  .classList.remove("loading");
                this.lgModal.cancel();
                this.loadCloudFolders();
              }
            );
          };
          this.lgModal.cancel = () => {
            uwFolderName();
            uwTitle();
            this.$set(this.lgModal, "data", {});
            this.lgModal.show = false;
          };
        }
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
    },
    checkLocalStatus() {
      document.querySelector(".xknote-check-local").classList.add("loading");
      window.axios
        .post("/api/notes/check", {
          checkList: Object.keys(this.localList)
        })
        .then(res => {
          this.lgModal.data = [];
          for (let key in this.localList) {
            this.lgModal.data.push({
              name: this.localList[key].name,
              path: this.localList[key].path,
              created_at_l: this.localList[key].note.created_at,
              updated_at_l: this.localList[key].note.updated_at,
              created_at_c: res.data.checkList[key].created_at,
              updated_at_c: res.data.checkList[key].updated_at
            });
          }
          this.navBarOperate("showCheckLocalStatus");
          document
            .querySelector(".xknote-check-local")
            .classList.remove("loading");
        });
    },
    checkLocalOperate(operate, index) {
      let path = this.lgModal.data[index].path;
      if (operate === "keepLocal") {
        this.noteOperate("read", "local", { path: path }, data => {
          this.noteOperate("save", "cloud", data, () => {
            this.localList[path].status = "C";
            this.$delete(this.lgModal.data, index);
            // 将更新后的状态保存到本地
            this.noteOperate("save", "local", this.localList[path]);
          });
        });
      }
      if (operate === "keepCloud") {
        this.noteOperate("read", "cloud", { path: path }, data => {
          this.noteOperate("save", "local", data, () => {
            this.localList[path].status = "C";
            this.$delete(this.lgModal.data, index);
          });
        });
      }
      if (operate === "notOpe") {
        this.$delete(this.lgModal.data, index);
      }
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
.active {
  color: #585858;
}
#toc li img {
  width: 1.05em;
}
</style>
