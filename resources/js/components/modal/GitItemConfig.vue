<template>
  <div class="form-horizontal">
    <form-group :config="data" :k="'repo'" :info="gitItemConfigInfo" :status="data.status"></form-group>
    <form-group :config="data" :k="'git_name'" :info="gitItemConfigInfo" :status="data.status"></form-group>
    <form-group :config="data" :k="'git_email'" :info="gitItemConfigInfo" :status="data.status"></form-group>
    <form-group :config="data" :k="'git_password'" :info="gitItemConfigInfo"></form-group>
  </div>
</template>

<script>
import { mapState } from "vuex";
import FormGroup from "../FormGroup";
import configInfo from "../../utils/configInfo";
export default {
  name: "git-item-config",
  components: {
    "form-group": FormGroup
  },
  data() {
    return {
      gitItemConfigInfo: configInfo.gitItemConfig
    };
  },
  computed: {
    ...mapState({
      data: state => state.tools.lgModal.data
    })
  }
};
</script>
