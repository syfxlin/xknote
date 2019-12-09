<template>
  <div class="form-horizontal">
    <template v-for="config in userConfig">
      <form-group
        v-for="(value, key) in config"
        :key="key"
        :config="config"
        :info="userConfigInfo"
        :k="key"
      ></form-group>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import configInfo from "../../utils/configInfo";
import FormGroup from "../FormGroup";
export default {
  label: "user-config",
  components: {
    "form-group": FormGroup
  },
  data() {
    return {
      userConfigInfo: configInfo.userConfig
    };
  },
  computed: {
    ...mapState("conf", ["userConfig"]),
    ...mapState({
      data: state => state.tools.lgModal.data,
      modal: state => state.tools.lgModal
    })
  },
  methods: {
    ...mapActions("tools", ["setLgModalData", "hideLgModal"]),
    ...mapActions("conf", ["configOperate"]),
    ...mapActions("toast", ["timeToast"])
  },
  created() {
    this.modal.title = "用户设置";
    this.modal.confirm = () => {
      document
        .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
        .classList.add("loading");
      this.configOperate({
        operate: "setUserConfig",
        config: this.userConfig
      })
        .then(data => {
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
            message: "设置遇到问题！(" + err.response.data.error + ")",
            status: "error",
            delay: 1000
          });
        });
    };
    this.modal.cancel = () => {
      this.hideLgModal();
    };
  }
};
</script>
