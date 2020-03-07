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
    this.modal.title = "用户设置";
    this.modal.confirm = {
      content: "保存",
      handler: () => {
        this.modal.confirm.loading = true;
        this.configOperate({
          operate: "setUserConfig",
          config: this.userConfig
        })
          .then(data => {
            this.modal.confirm.loading = false;
            this.modal.cancel.handler();
            this.timeToast({
              message: "设置成功！",
              status: "success",
              delay: 1000
            });
          })
          .catch(err => {
            this.modal.confirm.loading = false;
            this.timeToast({
              message: "设置遇到问题！(" + err.response.data.error + ")",
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
