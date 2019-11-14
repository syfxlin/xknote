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
        <select v-model="data.post_status" class="form-select">
          <option value="publish">publish</option>
          <option value="future">publish</option>
          <option value="draft">draft</option>
          <option value="pending">pending</option>
          <option value="private">private</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">别名</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.slug" />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">摘录</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.excerpt" />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">分类</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.categories" />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">标签</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.tags" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { toHtml } from "../../../../node_modules/xkeditor/src/utils/switchContent";
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
    ...mapActions("note", ["noteOperate"]),
    ...mapActions("toast", ["timeToast"])
  },
  created() {
    this.modal.title = "发布到博客";
    this.modal.confirm = () => {
      if (!this.data.title || !this.data.content || !this.data.post_status) {
        return;
      }
      document
        .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
        .classList.add("loading");
      let data = {
        title: this.data.title,
        content: toHtml(this.data.content, true),
        status: this.data.post_status
      };
      if (this.data.slug) {
        data.slug = this.data.slug;
      }
      if (this.data.excerpt) {
        data.excerpt = this.data.excerpt;
      }
      if (this.data.categories) {
        data.categories = this.data.categories;
      }
      if (this.data.tags) {
        data.tags = this.data.tags;
      }
      this.noteOperate({
        operate: "pushBlog",
        storage: null,
        noteInfo: data
      })
        .then(() => {
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.remove("loading");
          this.modal.cancel();
          this.timeToast({
            message: "发布成功！",
            status: "success",
            delay: 1000
          });
        })
        .catch(error => {
          this.timeToast({
            message: "发布失败，请重试！",
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
