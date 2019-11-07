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
            @click="switchShowSidebar()"
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
      <sidebar></sidebar>
      <section :class="'column ' + (!writeMode ? 'col-10' : 'col-12')" id="xknote-editor">
        <xk-editor
          :settingProps="userSetting"
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
import XK_Editor from "xkeditor";
import Dropdown from "./Dropdown";
import Sidebar from "./Sidebar";
import iSettingList from "../utils/settingList";
import dropdownList from "../utils/dropdownList";
export default {
  name: "home",
  components: {
    "xk-editor": XK_Editor,
    dropdown: Dropdown,
    sidebar: Sidebar
  },
  props: [],
  data() {
    return {
      settingList: iSettingList,
      navBarListC: dropdownList.navBarListC,
      navBarListR: dropdownList.navBarListR,
      loadedEditor: false
    };
  },
  computed: {
    ...mapState("note", ["xknoteOpened"]),
    ...mapState("tools", ["writeMode"]),
    ...mapGetters("conf", ["userSetting"])
  },
  methods: {
    ...mapActions("note", ["loadFirstNote"]),
    ...mapActions("menu", ["navBarOperate"]),
    ...mapActions("tools", ["switchShowSidebar"]),
    editorLoaded(e) {
      if (e === "interfaceLoad") {
        window.XKEditor.ace.getSession().on("change", () => {
          if (window.xknoteOpenedChangeFlag) {
            this.xknoteOpened.note.content = window.XKEditor.getMarkdown();
          }
        });
      }
      if (e === "componentLoad") {
        this.$nextTick(() => {
          this.loadFirstNote();
          this.loadedEditor = true;
        });
      }
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
