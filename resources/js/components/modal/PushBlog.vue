<template>
  <div class="form-horizontal">
    <form-group :config="data" :k="'title'" :info="pushBlogInfo"></form-group>
    <form-group :config="data" :k="'post_status'" :info="pushBlogInfo"></form-group>
    <form-group :config="data" :k="'slug'" :info="pushBlogInfo"></form-group>
    <form-group :config="data" :k="'excerpt'" :info="pushBlogInfo"></form-group>
    <form-group :config="data" :k="'categories'" :info="pushBlogInfo"></form-group>
    <form-group :config="data" :k="'tags'" :info="pushBlogInfo"></form-group>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FormGroup from "../FormGroup";
import configInfo from "../../utils/configInfo";
import { toHtml } from "../../../../node_modules/xkeditor/src/utils/switchContent";
export default {
  name: "push-blog",
  components: {
    "form-group": FormGroup
  },
  data() {
    return {
      pushBlogInfo: configInfo.pushBlog
    };
  },
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
        .catch(err => {
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.remove("loading");
          this.timeToast({
            message: "发布失败，请重试！(" + err.response.data.error + ")",
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
