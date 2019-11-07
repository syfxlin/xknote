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
                  <note-item :info="item" :status="item.status" :storage="'curr'" :mode="'normal'" />
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
                  />
                </li>
                <button
                  @click="checkLocalStatus()"
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
  </main>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { mapSyncActions } from "../store/syncActions";
import XK_Editor from "xkeditor";
import noteItem from "./noteItem";
import folderItem from "./folderItem";
import dropdown from "./dropdown";
import iSettingList from "../utils/settingList";
import dropdownList from "../utils/dropdownList";
export default {
  name: "home",
  components: {
    "xk-editor": XK_Editor,
    "note-item": noteItem,
    "folder-item": folderItem,
    dropdown
  },
  props: ["writeMode"],
  data() {
    return {
      settingList: iSettingList,
      navBarListC: dropdownList.navBarListC,
      navBarListR: dropdownList.navBarListR,
      showSidebar: false, // 该属性只有在writeMode有用
      loadedEditor: false
    };
  },
  computed: {
    ...mapState("note", [
      "xknoteOpened",
      "currList",
      "cloudList",
      "localList",
      "xknoteTab",
      "currBadgeCount",
      "localBadgeCount"
    ])
  },
  methods: {
    ...mapActions("note", ["switchTab", "loadCloudFolders", "loadFirstNote"]),
    ...mapActions("other", ["checkLocalStatus"]),
    ...mapActions("menu", ["navBarOperate"]),
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
