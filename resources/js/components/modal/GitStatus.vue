<template>
  <div class="git-status">
    <div v-if="data.status==='loading'">
      <div class="loading"></div>
      <div class="text-gray text-center">正在加载，客官莫急。</div>
    </div>
    <ul>
      <li v-for="item in data.statusData" :key="item.id">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "git-status",
  computed: {
    ...mapState({
      data: state => state.tools.lgModal.data
    })
  }
};
</script>
