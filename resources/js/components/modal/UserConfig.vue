<template>
  <div class="form-horizontal">
    <template v-for="config in userConfig">
      <div class="form-group" v-for="(value, key) in config" :key="key">
        <div class="col-3 col-sm-12">
          <label class="form-label">{{ settingList[key].label }}</label>
        </div>
        <div class="col-9 col-sm-12 has-icon-right">
          <select v-if="settingList[key].type==='select'" class="form-select" v-model="config[key]">
            <option
              v-for="item in settingList[key].options"
              :key="item.id"
              :value="item.value"
            >{{ item.label }}</option>
          </select>
          <template v-else-if="settingList[key].type==='radio'">
            <label
              v-for="item in settingList[key].options"
              :key="item.id"
              class="form-radio form-inline"
            >
              <input type="radio" :name="key" :value="item.value" v-model="config[key]" />
              <i class="form-icon"></i>
              {{ item.label }}
            </label>
          </template>
          <label v-else-if="settingList[key].type==='switch'" class="form-switch">
            <input type="checkbox" v-model="userConfig.tinymceSetting[key]" />
            <i class="form-icon"></i> 开启/关闭
          </label>
          <input v-else class="form-input" :type="settingList[key].type" v-model="config[key]" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import iSettingList from "../../utils/settingList";
export default {
  label: "user-config",
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
