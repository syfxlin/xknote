<template>
  <div class="form-horizontal">
    <form-group
      :config="data"
      :k="'git_name'"
      :info="gitConfigInfo"
      :status="data.status"
    ></form-group>
    <form-group
      :config="data"
      :k="'git_email'"
      :info="gitConfigInfo"
      :status="data.status"
    ></form-group>
    <form-group
      :config="data"
      :k="'git_password'"
      :info="gitConfigInfo"
    ></form-group>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FormGroup from "../FormGroup";
import configInfo from "../../utils/configInfo";
export default {
  name: "git-config",
  components: {
    "form-group": FormGroup
  },
  data() {
    return {
      gitConfigInfo: configInfo.gitConfig
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
    ...mapActions("conf", ["configOperate"]),
    ...mapActions("toast", ["timeToast"])
  },
  created() {
    this.modal.title = "Git设置";
    this.setMiModalData({
      ...this.data,
      status: "loading"
    });
    this.configOperate({
      operate: "getGitConfig",
      config: null
    })
      .then(info => {
        this.setMiModalData({
          ...this.data,
          status: "",
          git_name: info.git_name,
          git_email: info.git_email
        });
      })
      .catch(err => {
        this.timeToast({
          message: "获取信息失败！(" + err.response.data.error + ")",
          status: "error",
          delay: 1000
        });
        this.setMiModalData({
          ...this.data,
          status: ""
        });
      });
    this.modal.confirm = {
      content: "保存",
      handler: () => {
        if (
          !this.data.git_name ||
          !this.data.git_email ||
          !this.data.git_password ||
          this.data.status !== ""
        ) {
          return;
        }
        document
          .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
          .classList.add("loading");
        this.configOperate({
          operate: "setGitConfig",
          config: {
            git_name: this.data.git_name,
            git_email: this.data.git_email,
            git_password: this.data.git_password
          }
        })
          .then(() => {
            document
              .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
              .classList.remove("loading");
            this.modal.cancel();
            this.timeToast({
              message: "设置成功！",
              status: "success",
              delay: 1000
            });
          })
          .catch(err => {
            document
              .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
              .classList.remove("loading");
            this.timeToast({
              message: "设置失败，请重试！(" + err.response.data.error + ")",
              status: "error",
              delay: 1000
            });
          });
      }
    };
    this.modal.cancel = {
      handler: () => {
        this.hideMiModal();
      }
    };
  }
};
</script>
