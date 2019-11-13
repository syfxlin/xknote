<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">博客系统</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <select class="form-select" v-model="data.blog_system">
          <option value="wordpress">WordPress</option>
        </select>
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">博客链接</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input class="form-input" type="url" v-model="data.blog_url" required />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">用户名</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input class="form-input" type="text" v-model="data.blog_username" required />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">密码</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input class="form-input" type="password" v-model="data.blog_password" required />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">Token</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input class="form-input" type="password" v-model="data.blog_token" required />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "blog-config",
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
  },
  created() {
    this.modal.title = "博客设置";
    this.setLgModalData({
      ...this.data,
      status: "loading"
    });
    this.configOperate({
      operate: "getBlogConfig",
      config: null
    })
      .then(info => {
        this.setLgModalData({
          ...this.data,
          status: "",
          blog_system: info.blog_system,
          blog_url: info.blog_url,
          blog_username: info.blog_username,
          blog_password: info.blog_password,
          blog_token: info.blog_token
        });
      })
      .catch(error => {
        this.timeToast({
          message: "获取信息失败！",
          status: "error",
          delay: 1000
        });
        this.setLgModalData({
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
        .catch(error => {
          this.timeToast({
            message: "设置失败，请重试！",
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
