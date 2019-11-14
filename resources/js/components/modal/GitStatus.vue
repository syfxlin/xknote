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
import { mapState, mapActions } from "vuex";
export default {
  name: "git-status",
  computed: {
    ...mapState({
      data: state => state.tools.lgModal.data,
      modal: state => state.tools.lgModal
    })
  },
  methods: {
    ...mapActions("tools", ["setLgModalData", "hideLgModal"]),
    ...mapActions("note", ["folderOperate"]),
    ...mapActions("toast", ["timeToast"])
  },
  created() {
    this.modal.title = "Git状态";
    this.setLgModalData({
      ...this.data,
      status: "loading"
    });
    this.folderOperate({
      operate: "gitStatus",
      folderInfo: { path: this.data.path }
    }).then(status => {
      this.setLgModalData({
        ...this.data,
        status: "",
        statusData: status
      });
    });
    this.modal.confirm = () => {
      this.hideLgModal();
    };
    this.modal.cancel = () => {
      this.hideLgModal();
    };
  }
};
</script>
