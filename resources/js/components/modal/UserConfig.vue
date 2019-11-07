<template>
  <div class="form-horizontal">
    <div class="form-group" v-for="(value, key) in $refs.xkeditor.setting.aceSetting" :key="key">
      <div class="col-3 col-sm-12">
        <!-- TODO: 重命名 -->
        <label class="form-label">{{ settingList[key] }}</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input class="form-input" type="text" v-model="$refs.xkeditor.setting.aceSetting[key]" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "user-config"
};
</script>
