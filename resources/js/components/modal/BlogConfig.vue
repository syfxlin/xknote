<template>
  <div class="form-horizontal">
    <form-group
      :config="data"
      :k="'blog_system'"
      :info="blogConfigInfo"
      :status="data.status"
    ></form-group>
    <form-group
      :config="data"
      :k="'blog_url'"
      :info="blogConfigInfo"
      :status="data.status"
    ></form-group>
    <form-group
      :config="data"
      :k="'blog_username'"
      :info="blogConfigInfo"
      :status="data.status"
    ></form-group>
    <form-group
      :config="data"
      :k="'blog_password'"
      :info="blogConfigInfo"
      :status="data.status"
    ></form-group>
    <form-group
      :config="data"
      :k="'blog_token'"
      :info="blogConfigInfo"
      :status="data.status"
    ></form-group>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FormGroup from "../FormGroup";
import configInfo from "../../utils/configInfo";
export default {
  name: "blog-config",
  components: {
    "form-group": FormGroup
  },
  data() {
    return {
      blogConfigInfo: configInfo.blogConfig
    };
  },
  computed: {
    ...mapState({
      data: state => state.tools.miModal.data,
      modal: state => state.tools.miModal
    })
  },
  methods: {
    ...mapActions("tools", ["setMiModalData", "hideMiModal"]),
    ...mapActions("conf", ["configOperate"]),
    ...mapActions("toast", ["timeToast"])
  },
  created() {
    // TODO: 上传必须要有token的bug需要修复
    this.modal.title = "博客设置";
    this.setMiModalData({
      ...this.data,
      status: "loading"
    });
    this.configOperate({
      operate: "getBlogConfig",
      config: null
    })
      .then(info => {
        this.setMiModalData({
          ...this.data,
          status: "",
          blog_system: info.blog_system,
          blog_url: info.blog_url,
          blog_username: info.blog_username,
          blog_password: info.blog_password,
          blog_token: info.blog_token
        });
      })
      .catch(err => {
        this.timeToast({
          message: "获取信息失败！(" + err.response.data.error + ")",
          status: "error",
          delay: 1000
        });
        this.setMiModalData({
          ...this.data,
          status: ""
        });
      });
    this.modal.confirm = () => {
      if (
        !this.data.blog_system ||
        !this.data.blog_url ||
        !(
          this.data.blog_token ||
          (this.data.blog_username && this.data.blog_password)
        ) ||
        this.data.status !== ""
      ) {
        return;
      }
      document
        .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
        .classList.add("loading");
      let config = {
        blog_system: this.data.blog_system,
        blog_url: this.data.blog_url
      };
      if (this.data.blog_token) {
        config.blog_token = this.data.blog_token;
      } else {
        config.blog_username = this.data.blog_username;
        config.blog_password = this.data.blog_password;
      }
      this.configOperate({
        operate: "setBlogConfig",
        config: config
      })
        .then(() => {
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.remove("loading");
          this.modal.cancel();
          this.timeToast({
            message: "设置成功！",
            status: "success",
            delay: 1000
          });
        })
        .catch(err => {
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.remove("loading");
          this.timeToast({
            message: "设置失败，请重试！(" + err.response.data.error + ")",
            status: "error",
            delay: 1000
          });
        });
    };
    this.modal.cancel = () => {
      this.hideMiModal();
    };
  }
};
</script>
