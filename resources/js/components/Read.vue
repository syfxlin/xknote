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
      <aside class="col-3 p-fixed read-sidebar">
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
              :openNote="openNote"
            />
            <template v-if="cloudList.length===0">
              <div class="loading loading-lg"></div>
              <div class="text-gray text-center">正在加载，客官莫急。</div>
            </template>
          </li>
          <li v-show="xknoteTab==='local'" class="local-tab">
            <ul class="menu menu-nav">
              <li class="menu-item" v-for="item in localList" :key="item.id">
                <note-item
                  :info="item"
                  :status="item.status"
                  :storage="'local'"
                  :mode="'read'"
                  :openNote="openNote"
                />
              </li>
              <div class="text-gray text-center" v-if="localList.length===0">这里什么都没有哦（￣︶￣）↗</div>
            </ul>
          </li>
        </ul>
      </aside>
    </div>
    <div class="components">
      <router-link to="/" class="btn to-normal-btn">普通模式</router-link>
    </div>
  </main>
</template>

<script>
import noteItem from "./noteItem.vue";
import folderItem from "./folderItem.vue";
import {
  toHtml,
  getTocHtml
} from "../../../node_modules/xkeditor/src/utils/switchContent.js";
export default {
  name: "read-mode",
  components: {
    "note-item": noteItem,
    "folder-item": folderItem
  },
  props: ["cloudList", "localList", "readOpened", "openNote", "loadFirstNote"],
  data() {
    return {
      xknoteTab: "toc",
      tocHtml: "",
      previewHtml: ""
    };
  },
  methods: {
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
      });
    }
  },
  mounted() {
    this.watchNote();
    this.$nextTick(() => {
      this.loadFirstNote("read");
    });
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
  },
  watch: {
    "readOpened.note.content": "watchNote"
  }
};
</script>

<style>
.read-toc li img {
  width: 1.05em;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.4em;
  padding-top: 0.1em;
}
.read-toc li a {
  font-size: 1.05em;
  vertical-align: middle;
}
.hero-body p {
  margin: 0;
}
.read-sidebar {
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.read-sidebar .xknote-tab-content {
  margin: 0.8rem 0 0.8rem 1.6rem;
}
.read-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  border-right: 1px solid #ddd;
}
.read-header .hero-body {
  padding: 0.4rem 3rem;
}
.read-content {
  flex: 1;
  padding: 2rem 3rem;
}
.read-footer {
  padding: 1.5em 0 !important;
}
.to-normal-btn {
  bottom: 1rem;
  right: 1rem;
  position: fixed;
}
</style>
