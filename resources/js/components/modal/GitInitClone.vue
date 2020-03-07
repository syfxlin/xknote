<template>
  <div class="form-horizontal">
    <form-group
      :config="data"
      :k="'repo'"
      :info="gitInitCloneInfo"
    ></form-group>
    <form-group
      :config="data"
      :k="'foldername'"
      :info="gitInitCloneInfo"
      :status="data.status"
    ></form-group>
    <form-group
      :config="data"
      :k="'init_or_clone'"
      :info="gitInitCloneInfo"
    ></form-group>
    <form-group
      :config="data"
      :k="'git_name'"
      :info="gitInitCloneInfo"
    ></form-group>
    <form-group
      :config="data"
      :k="'git_email'"
      :info="gitInitCloneInfo"
    ></form-group>
    <form-group
      :config="data"
      :k="'git_password'"
      :info="gitInitCloneInfo"
    ></form-group>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FormGroup from "../FormGroup";
import configInfo from "../../utils/configInfo";
export default {
  name: "git-init-clone",
  components: {
    "form-group": FormGroup
  },
  data() {
    return {
      gitInitCloneInfo: configInfo.gitInitClone
    };
  },
  computed: {
    ...mapState({
      data: state => state.tools.miModal.data,
      modal: state => state.tools.miModal
    })
  },
  methods: {
    ...mapActions("tools", ["setMiModalData", "hideMiModal"]),
    ...mapActions("note", ["folderOperate"]),
    ...mapActions("toast", ["timeToast"])
  },
  created() {
    this.modal.title = "Git InitClone";
    let wTimeout = null;
    let watch = () => {
      if (wTimeout) {
        clearTimeout(wTimeout);
      }
      wTimeout = setTimeout(() => {
        this.setMiModalData({
          ...this.data,
          status: "loading"
        });
        this.folderOperate({
          operate: "exist",
          folderInfo: {
            path: this.data.foldername + "/.git"
          }
        }).then(data => {
          if (data.exist) {
            this.setMiModalData({
              ...this.data,
              status: "error"
            });
          } else {
            this.setMiModalData({
              ...this.data,
              status: ""
            });
          }
        });
      }, 500);
    };
    let uwFolderName = this.$watch("data.foldername", watch);
    this.modal.confirm = {
      content: "克隆",
      handler: () => {
        if (
          !this.data.foldername ||
          !this.data.repo ||
          !this.data.init_or_clone ||
          this.data.status !== ""
        ) {
          return;
        }
        this.modal.confirm.loading = true;
        let git_user = {};
        if (
          this.data.git_name &&
          this.data.git_email &&
          this.data.git_password
        ) {
          git_user = {
            git_name: this.data.git_name,
            git_email: this.data.git_email,
            git_password: this.data.git_password
          };
        }
        this.folderOperate({
          operate: this.data.init_or_clone === "init" ? "gitInit" : "gitClone",
          folderInfo: {
            path: this.data.foldername,
            repo: this.data.repo,
            git_user: git_user
          }
        })
          .then(() => {
            this.modal.confirm.loading = false;
            this.modal.cancel.handler();
            this.timeToast({
              message: "Git Init或Clone成功！",
              status: "success",
              delay: 1000
            });
          })
          .catch(err => {
            this.modal.confirm.loading = false;
            this.timeToast({
              message:
                "Init/Clone失败，请重试！(" + err.response.data.error + ")",
              status: "error",
              delay: 1000
            });
          });
      }
    };
    this.modal.cancel = {
      handler: () => {
        uwFolderName();
        this.hideMiModal();
      }
    };
  }
};
</script>
