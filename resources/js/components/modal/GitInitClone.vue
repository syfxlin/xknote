<template>
  <div class="form-horizontal">
    <form-group :config="data" :k="'repo'" :info="gitInitCloneInfo"></form-group>
    <form-group :config="data" :k="'foldername'" :info="gitInitCloneInfo" :status="data.status"></form-group>
    <form-group :config="data" :k="'init_or_clone'" :info="gitInitCloneInfo"></form-group>
    <form-group :config="data" :k="'git_name'" :info="gitInitCloneInfo"></form-group>
    <form-group :config="data" :k="'git_email'" :info="gitInitCloneInfo"></form-group>
    <form-group :config="data" :k="'git_password'" :info="gitInitCloneInfo"></form-group>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
      data: state => state.tools.lgModal.data
    })
  }
};
</script>
