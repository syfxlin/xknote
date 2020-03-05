<template>
  <main class="home">
    <navbar></navbar>
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
import save from "../menu/nav/save";
import XK_Editor from "xkeditor";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
export default {
  name: "home",
  components: {
    "xk-editor": XK_Editor,
    navbar: Navbar,
    sidebar: Sidebar
  },
  props: [],
  data() {
    return {
      loadedEditor: false,
      xkeditorData: {
        graff: {}
      }
    };
  },
  computed: {
    ...mapState("note", ["xknoteOpened"]),
    ...mapState("tools", ["writeMode"]),
    ...mapGetters("conf", ["userSetting"])
  },
  methods: {
    ...mapActions("note", ["loadFirstNote"]),
    editorLoaded(e) {
      let keys = [
        {
          name: "saveCloud",
          win: "Ctrl-S",
          mac: "Command-S",
          exec: () => {
            save.cloud.handler();
          }
        },
        {
          name: "saveAllCloud",
          win: "Ctrl-Shift-S",
          mac: "Command-Shift-S",
          exec: () => {
            save.allCloud.handler();
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
