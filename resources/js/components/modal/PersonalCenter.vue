<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">用户名</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input :value="data.username" class="form-input" type="text" disabled />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">昵称</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input v-model="data.nickname" class="form-input" type="text" required />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">邮箱</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input v-model="data.email" class="form-input" type="email" required />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">旧密码</label>
      </div>
      <div class="col-9 col-sm-12">
        <input v-model="data.old_password" class="form-input" type="password" required />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">新密码</label>
      </div>
      <div class="col-9 col-sm-12">
        <input v-model="data.password" class="form-input" type="password" required />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">确认密码</label>
      </div>
      <div class="col-9 col-sm-12">
        <input v-model="data.password_confirmation" class="form-input" type="password" required />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "personal-center",
  computed: {
    ...mapState({
      data: state => state.tools.lgModal.data,
      modal: state => state.tools.lgModal
    })
  },
  methods: {
    ...mapActions("tools", ["setLgModalData", "hideLgModal"]),
    ...mapActions("user", ["getUser", "setUser"]),
    ...mapActions("toast", ["timeToast"])
  },
  created() {
    this.modal.title = "个人中心";
    this.setLgModalData({
      ...this.data,
      status: "loading"
    });
    this.getUser()
      .then(info => {
        this.setLgModalData({
          ...this.data,
          status: "",
          username: info.username,
          nickname: info.nickname,
          email: info.email
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
        !this.data.email ||
        !this.data.nickname ||
        !this.data.password_confirmation ||
        !this.data.password ||
        !this.data.old_password ||
        this.data.status !== ""
      ) {
        return;
      }
      document
        .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
        .classList.add("loading");
      this.setUser({
        user: this.data
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
