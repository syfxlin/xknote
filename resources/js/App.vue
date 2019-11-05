<template>
  <main id="app-main">
    <transition name="fade" mode="out-in">
      <router-view ref="children"></router-view>
    </transition>
    <div :class="'toast toast-' + toast.status">
      <button class="btn btn-clear float-right"></button>
      <p>{{ toast.message }}</p>
    </div>
  </main>
</template>

<script>
import "./assets/style.css";
import { mapState, mapActions, mapGetters } from "vuex";
import { mapSyncActions } from "./store/syncActions";
export default {
  name: "App",
  async created() {
    // 当打开note中的时候防止更改
    window.xknoteOpenedChangeFlag = true;
    // 是否是通过输入URL引发的query变动
    window.inputQueryChangeFlag = true;
    await this.loadCloudFolders();
  },
  data() {
    return {};
  },
  mounted() {
    this.loadLocalNotes();
    window.xknote = {};
  },
  computed: {
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
      "setXknoteOpened",
      "prevRouter"
    ]),
    ...mapState({
      toast: state => state.toast
    }),
    ...mapGetters("note", ["getReData"])
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
      "setXknoteOpenedIndexA",
      "openNote",
      "loadPathNote",
      "loadFirstNote",
      "setPrevRouter"
    ]),
    ...mapActions("toast", ["timeToast"]),
    ...mapActions("db", ["optionsDB"]),
    ...mapSyncActions("note", ["listOperate"]),
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
    },
    "toast.show": function(val) {
      let toast = document.querySelector(".toast");
      if (val) {
        toast.style.visibility = "visible";
        toast.style.opacity = "1";
      } else {
        setTimeout(() => {
          toast.style.visibility = "hidden";
        }, 500);
        toast.style.opacity = "0";
      }
    }
  }
};
</script>

<style>
#app-main {
  height: 100%;
}
</style>
