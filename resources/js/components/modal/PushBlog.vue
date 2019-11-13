<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">标题</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.title" required />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">发布状态</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.status" required />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">别名</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.slug" required />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">摘录</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.excerpt" required />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">分类</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.categories" required />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">标签</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.tags" required />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "push-blog",
  computed: {
    ...mapState({
      data: state => state.tools.lgModal.data,
      modal: state => state.tools.lgModal
    })
  },
  methods: {
    ...mapActions("tools", ["setLgModalData", "hideLgModal"]),
    ...mapActions("conf", ["configOperate"]),
    ...mapActions("toast", ["timeToast"])
  }
};
</script>
