<template>
  <div class="columns">
    <section class="column col-2">
      <div v-if="logs.length===0">
        <div class="loading"></div>
        <div class="text-gray text-center">正在加载，客官莫急。</div>
      </div>
      <div v-for="log in logs" :key="log.id" class="tile tile-centered">
        <div class="tile-content" @click="loadDiff(log)">
          <div class="tile-title" :title="log.message">{{ log.message }}</div>
          <small
            class="tile-subtitle text-gray"
            :title="log.commit + ' - ' + log.date"
          >{{ log.commit }} - {{ log.date }}</small>
        </div>
        <div class="tile-action">
          <button class="btn btn-link">
            <i class="icon icon-more-vert"></i>
          </button>
        </div>
      </div>
    </section>
    <section class="column col-10">
      <div class="diff-html" v-html="diffHtml"></div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "note-history",
  data() {
    return {
      logs: [],
      repoPath: "",
      filePath: "",
      diffHtml: ""
    };
  },
  computed: {
    ...mapState({
      data: state => state.tools.llgModal.data,
      modal: state => state.tools.llgModal
    }),
    ...mapState("note", ["xknoteOpened"])
  },
  methods: {
    ...mapActions("tools", ["setLlgModalData", "hideLlgModal"]),
    ...mapActions("other", ["diffOperate"]),
    loadDiff(log) {
      this.diffOperate({
        operate: "getDiff",
        path: this.repoPath,
        file: this.filePath,
        commit: log.commit
      }).then(diffs => {
        this.diffHtml = window.Diff2Html.getPrettyHtml(diffs, {
          inputFormat: "diff",
          showFiles: false,
          matching: "lines",
          outputFormat: "side-by-side"
        });
      });
    }
  },
  created() {
    this.modal.title = "笔记历史";
    this.modal.confirm = () => {
      this.hideLlgModal();
    };
    this.modal.cancel = () => {
      this.hideLlgModal();
    };
    let pathIndex = this.xknoteOpened.path.indexOf("/", 1);
    this.repoPath = this.xknoteOpened.path.substring(0, pathIndex);
    this.filePath = this.xknoteOpened.path.substring(pathIndex);
    // TODO: 错误处理
    this.diffOperate({
      operate: "getLog",
      path: this.repoPath,
      file: this.filePath
    }).then(logs => {
      this.logs = logs;
    });
  }
};
</script>
