<template>
  <main class="home">
    <header class="navbar xknote-header">
      <section class="navbar-section col-2 navbar-left">
        <img class="xknote-icon" src="/logo.png" alt="XK-Note icon" />
        <a href="#" class="btn btn-link text-large">{{ xknoteName }}</a>
        <transition name="fade" mode="out-in">
          <button
            class="btn btn-action btn-lg"
            title="开启/关闭侧边栏"
            v-if="isMinScreen || writeMode"
            @click="switchShowSidebar()"
          >
            <i class="icon icon-menu"></i>
          </button>
        </transition>
      </section>
      <section v-show="showNavBarCenter" class="navbar-center">
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
          :right="true"
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
      <section v-show="showNavBarRight" class="navbar-section navbar-right">
        <dropdown
          :mainItem="navBarListR[0].mainItem"
          :items="navBarListR[0].items"
          :operate="navBarOperate"
          :right="true"
        />
        <router-link to="/read" class="btn btn-link">阅读模式</router-link>
        <router-link v-if="!writeMode" to="/write" class="btn btn-link"
          >写作模式</router-link
        >
        <router-link v-if="writeMode" to="/" class="btn btn-link"
          >普通模式</router-link
        >
        <a @click="navBarOperate('showImageItem')" class="btn btn-link">图片</a>
        <dropdown
          :mainItem="navBarListR[1].mainItem"
          :items="navBarListR[1].items"
          :operate="navBarOperate"
          :right="true"
        />
      </section>
      <div class="navbar-center-mbtn">
        <button class="btn btn-action btn-lg" @click="switchShowNavBarCenter()">
          <i class="icon icon-menu"></i>
        </button>
      </div>
      <div class="navbar-right-mbtn">
        <button class="btn btn-action btn-lg" @click="switchShowNavBarRight()">
          <i class="icon icon-menu"></i>
        </button>
      </div>
    </header>
    <div class="columns xknote-main">
      <sidebar></sidebar>
      <section
        :class="'column ' + (!writeMode ? 'col-10' : 'col-12 write-mode')"
        id="xknote-editor"
      >
        <xk-editor
          v-model="xknoteOpened.note.content"
          :config="userSetting"
          :data.sync="xkeditorData"
          v-on:loaded="editorLoaded"
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
      navBarListC: dropdownList.navBarListC,
      navBarListR: dropdownList.navBarListR,
      loadedEditor: false,
      xknoteName: window.xknote.xknote_name,
      xkeditorData: {
        graff: {}
      }
    };
  },
  computed: {
    ...mapState("note", ["xknoteOpened"]),
    ...mapState("tools", [
      "writeMode",
      "isMinScreen",
      "showNavBarRight",
      "showNavBarCenter"
    ]),
    ...mapGetters("conf", ["userSetting"])
  },
  methods: {
    ...mapActions("note", ["loadFirstNote"]),
    ...mapActions("menu", ["navBarOperate"]),
    ...mapActions("tools", [
      "switchShowSidebar",
      "switchShowNavBarRight",
      "switchShowNavBarCenter"
    ]),
    editorLoaded(e) {
      let keys = [
        {
          name: "saveCloud",
          win: "Ctrl-S",
          mac: "Command-S",
          exec: () => {
            this.navBarOperate("saveCloud");
          }
        },
        {
          name: "saveAllCloud",
          win: "Ctrl-Shift-S",
          mac: "Command-Shift-S",
          exec: () => {
            this.navBarOperate("saveAllCloud");
          }
        }
      ];
      this.$nextTick(() => {
        this.loadFirstNote();
        this.loadedEditor = true;
        window.XKEditor.addKeys(keys);
      });
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
#resizor {
  z-index: 99;
}
</style>
