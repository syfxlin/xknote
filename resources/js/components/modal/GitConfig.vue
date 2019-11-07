<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">Git用户名</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input class="form-input" type="text" v-model="data.git_name" required />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">Git邮箱</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input class="form-input" type="email" v-model="data.git_email" required />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">Git密码</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="password" v-model="data.git_password" required />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "git-config",
  computed: {
    ...mapState({
      data: state => state.tools.lgModal.data
    })
  }
};
</script>
