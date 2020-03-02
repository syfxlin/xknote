<template>
  <div class="all-note-history">
    <div v-if="status === 'loading'">
      <div class="loading"></div>
      <div class="text-gray text-center">正在加载，客官莫急。</div>
    </div>
    <div class="diff-html" v-html="diffHtml"></div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "all-note-history",
  data() {
    return {
      status: "",
      diffHtml: ""
    };
  },
  computed: {
    ...mapState({
      data: state => state.tools.lgModal.data,
      modal: state => state.tools.lgModal
    })
  },
  methods: {
    ...mapActions("tools", ["setLgModalData", "hideLgModal"]),
    ...mapActions("other", ["diffOperate"]),
    ...mapActions("toast", ["timeToast"])
  },
  created() {
    this.modal.title = "所有笔记历史";
    this.modal.confirm = () => {
      this.hideLgModal();
    };
    this.modal.cancel = () => {
      this.hideLgModal();
    };
    this.status = "loading";
    this.diffOperate({
      operate: "getAllDiff",
      path: this.data.path
    })
      .then(diffs => {
        this.status = "";
        this.diffHtml = window.Diff2Html.getPrettyHtml(diffs, {
          inputFormat: "diff",
          showFiles: true,
          matching: "lines",
          outputFormat:
            window.innerWidth < 991 ? "line-by-line" : "side-by-side"
        });
      })
      .catch(err => {
        this.status = "";
        this.timeToast({
          message: "读取历史记录失败！(" + err.response.data.error + ")",
          status: "error",
          delay: 1000
        });
      });
  }
};
</script>
