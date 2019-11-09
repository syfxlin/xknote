<template>
  <div class="form-horizontal">
    <template v-for="config in userConfig">
      <form-group
        v-for="(value, key) in config"
        :key="key"
        :config.sync="config"
        :info.sync="settingList"
        :k="key"
      ></form-group>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import iSettingList from "../../utils/settingList";
import FormGroup from "../FormGroup";
export default {
  label: "user-config",
  components: {
    "form-group": FormGroup
  },
  data() {
    return {
      settingList: iSettingList
    };
  },
  computed: {
    ...mapState("conf", ["userConfig"])
  }
};
</script>
