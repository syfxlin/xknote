<template>
  <main id="app-main">
    <transition name="fade" mode="out-in">
      <router-view ref="children"></router-view>
    </transition>
    <tools></tools>
  </main>
</template>

<script>
import Tools from "./components/Tools";
import "./assets/style.css";
import { mapState, mapActions } from "vuex";
import { mapSyncActions } from "./store/syncActions";
export default {
  name: "App",
  components: {
    tools: Tools
  },
  created() {
    // 当打开note中的时候防止更改
    window.xknoteOpenedChangeFlag = true;
    // 是否是通过输入URL引发的query变动
    window.inputQueryChangeFlag = true;
  },
  computed: {
    ...mapState("note", [
      "xknoteOpened",
      "xknoteOpenedIndex",
      "readOpened",
      "setXknoteOpened",
      "prevRouter"
    ])
  },
  methods: {
    ...mapActions("note", [
      "setXknoteOpenedA",
      "setReadOpenedA",
      "loadPathNote",
      "setPrevRouter"
    ]),
    ...mapSyncActions("note", ["listOperate"]),
    ...mapActions("tools", ["switchWriteMode"]),
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
      this.switchWriteMode(to.name === "Write");
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
