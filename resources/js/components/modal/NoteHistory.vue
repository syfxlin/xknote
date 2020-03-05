<template>
  <div class="columns">
    <section class="column col-2">
      <div v-if="logs.length === 0">
        <div class="loading"></div>
        <div class="text-gray text-center">正在加载，客官莫急。</div>
      </div>
      <div
        v-for="log in logs"
        :key="log.id"
        :class="
          'tile tile-centered' + (log.commit === curr.commit ? ' active' : '')
        "
      >
        <div class="tile-content" @click="loadDiff(log)">
          <div class="tile-title" :title="log.message">{{ log.message }}</div>
          <small
            class="tile-subtitle text-gray"
            :title="log.commit + ' - ' + log.date"
            >{{ log.commit }} - {{ log.date }}</small
          >
        </div>
        <div class="tile-action">
          <i
            v-if="log.commit === curr.commit && status === 'loading'"
            class="icon loading"
          ></i>
        </div>
      </div>
    </section>
    <section class="column col-10">
      <div class="input-group">
        <span class="input-group-addon">若你不知道这是什么请不要随意修改</span>
        <input
          type="text"
          class="form-input"
          placeholder="回滚到指定commit"
          v-model="curr.commit"
        />
        <button
          @click="rollback()"
          :class="
            'btn btn-primary input-group-btn' +
              (confirm === 'loading' ? ' loading' : '')
          "
        >
          {{ confirm ? "确定？" : "从该版本还原" }}
        </button>
      </div>
      <div class="diff-html" v-html="diffHtml"></div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import diff2html from "diff2html";
export default {
  name: "note-history",
  data() {
    return {
      logs: [],
      repoPath: "",
      filePath: "",
      diffHtml: "",
      curr: {},
      status: "",
      confirm: false
    };
  },
  computed: {
    ...mapState({
      data: state => state.tools.lgModal.data,
      modal: state => state.tools.lgModal
    }),
    ...mapState("note", ["xknoteOpened"])
  },
  methods: {
    ...mapActions("tools", ["setLgModalData", "hideLgModal"]),
    ...mapActions("other", ["diffOperate"]),
    ...mapActions("toast", ["timeToast"]),
    ...mapActions("note", ["openNote"]),
    loadDiff(log) {
      this.curr = log;
      this.status = "loading";
      this.diffOperate({
        operate: "getDiff",
        path: this.repoPath,
        file: this.filePath,
        commit: log.commit
      }).then(diffs => {
        this.status = "";
        this.diffHtml = diff2html.getPrettyHtml(diffs, {
          inputFormat: "diff",
          showFiles: false,
          matching: "lines",
          outputFormat:
            window.innerWidth < 991 ? "line-by-line" : "side-by-side"
        });
      });
    },
    rollback() {
      if (!this.confirm) {
        this.confirm = true;
        return;
      }
      this.confirm = "loading";
      this.diffOperate({
        operate: "rollback",
        commit: this.curr.commit,
        path: this.repoPath,
        file: this.filePath
      })
        .then(() => {
          this.confirm = false;
          this.hideLgModal();
          this.timeToast({
            message: "回滚成功！",
            status: "success",
            delay: 1000
          });
          this.openNote({
            note: this.xknoteOpened,
            source: {
              path: this.xknoteOpened.path,
              storage: "cloud"
            }
          });
        })
        .catch(err => {
          this.timeToast({
            message: "回滚失败！(" + err.response.data.error + ")",
            status: "error",
            delay: 1000
          });
        });
    }
  },
  created() {
    this.modal.title = "笔记历史";
    this.modal.confirm = null;
    this.modal.cancel = {
      content: "关闭",
      handler: () => {
        this.hideLgModal();
      }
    };
    let pathIndex = this.xknoteOpened.path.indexOf("/", 1);
    this.repoPath = this.xknoteOpened.path.substring(0, pathIndex);
    this.filePath = this.xknoteOpened.path.substring(pathIndex);
    // TODO: 错误处理
    this.diffOperate({
      operate: "getLog",
      path: this.repoPath,
      file: this.filePath
    })
      .then(logs => {
        this.logs = logs;
      })
      .catch(err => {
        this.timeToast({
          message: "读取历史记录失败！(" + err.response.data.error + ")",
          status: "error",
          delay: 1000
        });
      });
  }
};
</script>
