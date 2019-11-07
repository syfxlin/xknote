<template>
  <main id="app-main">
    <transition name="fade" mode="out-in">
      <router-view ref="children"></router-view>
    </transition>
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
                    <button
                      class="btn"
                      @click="checkLocalOperate({operate: 'keepLocal', index: index})"
                    >保留本地</button>
                    <button
                      class="btn"
                      @click="checkLocalOperate({operate: 'keepCloud', index: index})"
                    >保留云端</button>
                    <button
                      class="btn"
                      @click="checkLocalOperate({operate: 'notOpe', index: index})"
                    >不操作</button>
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
      <div :class="'toast toast-' + toast.status">
        <button class="btn btn-clear float-right"></button>
        <p>{{ toast.message }}</p>
      </div>
    </div>
  </main>
</template>

<script>
import onlyFolderItem from "./components/onlyFolderItem";
import modal from "./components/modal";
import "./assets/style.css";
import { mapState, mapActions, mapGetters } from "vuex";
import { mapSyncActions } from "./store/syncActions";
export default {
  name: "App",
  components: {
    "only-folder-item": onlyFolderItem,
    modal
  },
  created() {
    // 当打开note中的时候防止更改
    window.xknoteOpenedChangeFlag = true;
    // 是否是通过输入URL引发的query变动
    window.inputQueryChangeFlag = true;
  },
  data() {
    return {};
  },
  mounted() {
    window.xknote = {};
  },
  computed: {
    ...mapState("note", [
      "xknoteOpened",
      "xknoteOpenedIndex",
      "readOpened",
      "setXknoteOpened",
      "prevRouter"
    ]),
    ...mapState("tools", ["smModal", "lgModal", "floatMenu"]),
    ...mapState({
      toast: state => state.toast
    })
  },
  methods: {
    ...mapActions("note", [
      "setXknoteOpenedA",
      "setReadOpenedA",
      "loadPathNote",
      "setPrevRouter"
    ]),
    ...mapSyncActions("note", ["listOperate"]),
    ...mapActions("menu", ["floatMenuOperate"]),
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
      this.setPrevRouter(from.name);
      if (window.inputQueryChangeFlag && to.name === "Read") {
        this.setReadOpenedA(JSON.parse(JSON.stringify(this.xknoteOpened)));
      }
      if (window.inputQueryChangeFlag && this.$route.query.note) {
        let mode = "normal";
        if (this.$route.name === "Read") {
          mode = "read";
        }
        this.loadPathNote({ path: this.$route.query.note, mode: mode });
      }
      window.inputQueryChangeFlag = true;
    }
  }
};
</script>

<style>
#app-main {
  height: 100%;
}
</style>
