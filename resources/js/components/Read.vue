<template>
  <main class="read-home container">
    <div class="columns">
      <section class="col-9 read-container">
        <header class="hero hero-sm bg-gray read-header">
          <div class="hero-body">
            <h1>{{ readOpened.note.title }}</h1>
            <div class="columns">
              <p class="column col-4">作者：{{ readOpened.note.author }}</p>
              <p class="column col-4">创建时间：{{ readOpened.note.created_at }}</p>
              <p class="column col-4">修改时间：{{ readOpened.note.updated_at }}</p>
            </div>
          </div>
        </header>
        <article class="markdown-body read-content" v-html="previewHtml"></article>
        <footer class="xknote-copyright bg-gray read-footer">
          ©
          <a href="https://github.com/syfxlin/xknote">XK-Note</a> By
          <a href="https://ixk.me">Otstar Lin</a>
        </footer>
      </section>
      <transition name="fade" mode="out-in">
        <aside v-show="!isMinScreen||showSidebar" class="col-3 p-fixed read-sidebar">
          <ul class="tab tab-block xknote-tab">
            <li class="tab-item">
              <a :class="xknoteTab==='toc' ? 'active' : ''" @click="switchTab('toc')">大纲</a>
            </li>
            <li :class="'tab-item ' + (xknoteTab==='cloud' ? 'active' : '')">
              <a @click="switchTab('cloud')">云端</a>
            </li>
            <li class="tab-item">
              <a :class="xknoteTab==='local' ? 'active' : ''" @click="switchTab('local')">本地</a>
            </li>
          </ul>
          <ul class="xknote-tab-content">
            <li v-show="xknoteTab==='toc'" v-html="tocHtml" class="read-toc"></li>
            <li v-show="xknoteTab==='cloud'" class="cloud-tab">
              <folder-item
                v-for="item in cloudList"
                :key="item.id"
                :info="item"
                :storage="'cloud'"
                :mode="'read'"
              />
              <template v-if="cloudList.length===0">
                <div class="loading loading-lg"></div>
                <div class="text-gray text-center">正在加载，客官莫急。</div>
              </template>
            </li>
            <li v-show="xknoteTab==='local'" class="local-tab">
              <ul class="menu menu-nav">
                <li class="menu-item" v-for="item in localList" :key="item.id">
                  <note-item :info="item" :status="item.status" :storage="'local'" :mode="'read'" />
                </li>
                <div class="text-gray text-center" v-if="localList.length===0">这里什么都没有哦（￣︶￣）↗</div>
              </ul>
            </li>
          </ul>
        </aside>
      </transition>
    </div>
    <div class="components">
      <router-link to="/" class="btn to-normal-btn">普通模式</router-link>
      <button
        class="btn btn-action read-show-sidebar-btn"
        title="开启/关闭侧边栏"
        v-if="isMinScreen"
        @click="switchShowSidebar()"
      >
        <i class="icon icon-menu"></i>
      </button>
    </div>
  </main>
</template>

<script>
import NoteItem from "./NoteItem";
import FolderItem from "./FolderItem";
import xkeditorStore from "../../../node_modules/xkeditor/src/store";
import {
  toHtml,
  getTocHtml
} from "../../../node_modules/xkeditor/src/utils/switchContent.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "read-mode",
  components: {
    "note-item": NoteItem,
    "folder-item": FolderItem
  },
  props: [],
  data() {
    return {
      xknoteTab: "toc",
      tocHtml: "",
      previewHtml: ""
    };
  },
  computed: {
    ...mapState("note", ["cloudList", "localList", "readOpened"]),
    ...mapState("tools", ["showSidebar", "isMinScreen"])
  },
  methods: {
    ...mapActions("note", ["loadFirstNote"]),
    ...mapActions("tools", ["switchShowSidebar"]),
    switchTab(tabName) {
      this.xknoteTab = tabName;
    },
    initTocTree() {
      var items = document.querySelectorAll(
        ".read-toc .toc-img ~ ul,.toc .toc-img ~ ul"
      );
      for (let i = 0; i < items.length; i++) {
        items[i].parentNode.children[0].setAttribute(
          "src",
          "/static/svg/minus-square.svg"
        );
        items[i].parentNode.children[0].setAttribute(
          "onclick",
          "toggleToc(this)"
        );
      }
    },
    watchNote() {
      this.previewHtml = toHtml(this.readOpened.note.content, true);
      this.tocHtml = getTocHtml();
      this.$nextTick(() => {
        this.initTocTree();
        xkeditorStore.actions.updateRunCode();
        console.log("in");
      });
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.loadFirstNote("read");
      await this.watchNote();
      if (!window.toggleToc) {
        window.toggleToc = ele => {
          var display = ele.nextElementSibling.nextElementSibling.style.display;
          if (display === "" || display === "block") {
            ele.nextElementSibling.nextElementSibling.style.display = "none";
            ele.setAttribute("src", "/static/svg/plus-square.svg");
          } else {
            ele.nextElementSibling.nextElementSibling.style.display = "block";
            ele.setAttribute("src", "/static/svg/minus-square.svg");
          }
        };
      }
      if (!window.sta) {
        window.sta = anchorName => {
          if (anchorName) {
            let anchorElement = document.getElementById(anchorName);
            if (anchorElement) {
              anchorElement.scrollIntoView(true);
            }
          }
        };
      }
    });
  },
  watch: {
    readOpened: "watchNote"
  }
};
</script>

<style>
</style>
