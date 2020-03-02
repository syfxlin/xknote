<template>
  <div class="form-horizontal">
    <form-group
      :config="data"
      :k="'username'"
      :info="personalCenterInfo"
      :status="data.status"
    ></form-group>
    <form-group
      :config="data"
      :k="'nickname'"
      :info="personalCenterInfo"
      :status="data.status"
    ></form-group>
    <form-group
      :config="data"
      :k="'email'"
      :info="personalCenterInfo"
      :status="data.status"
    ></form-group>
    <form-group
      :config="data"
      :k="'old_password'"
      :info="personalCenterInfo"
    ></form-group>
    <form-group
      :config="data"
      :k="'password'"
      :info="personalCenterInfo"
    ></form-group>
    <form-group
      :config="data"
      :k="'password_confirmation'"
      :info="personalCenterInfo"
    ></form-group>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FormGroup from "../FormGroup";
import configInfo from "../../utils/configInfo";
export default {
  name: "personal-center",
  components: {
    "form-group": FormGroup
  },
  data() {
    return {
      personalCenterInfo: configInfo.personalCenter
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
    ...mapActions("user", ["getUser", "setUser"]),
    ...mapActions("toast", ["timeToast"])
  },
  created() {
    this.modal.title = "个人中心";
    this.setMiModalData({
      ...this.data,
      status: "loading"
    });
    this.getUser()
      .then(info => {
        this.setMiModalData({
          ...this.data,
          status: "",
          username: info.username,
          nickname: info.nickname,
          email: info.email
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
    this.modal.confirm = () => {
      if (
        !this.data.email ||
        !this.data.nickname ||
        !this.data.password_confirmation ||
        !this.data.password ||
        !this.data.old_password ||
        this.data.status !== ""
      ) {
        return;
      }
      document
        .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
        .classList.add("loading");
      this.setUser({
        user: this.data
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
    };
    this.modal.cancel = () => {
      this.hideMiModal();
    };
  }
};
</script>
