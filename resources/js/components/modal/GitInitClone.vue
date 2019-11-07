<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">Repo地址</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="url" v-model="data.repo" required />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">文件夹名</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input
          :class="'form-input' + (data.status === 'error' ? ' is-error' : '')"
          type="text"
          v-model="data.foldername"
          required
        />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">Init/Clone</label>
      </div>
      <div class="col-9 col-sm-12">
        <select class="form-select" v-model="data.init_or_clone" required>
          <option value="init">Init</option>
          <option value="clone">Clone</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">Git用户名</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.git_name" placeholder="若不填写则使用全局默认的配置" />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">Git邮箱</label>
      </div>
      <div class="col-9 col-sm-12">
        <input
          class="form-input"
          type="email"
          v-model="data.git_email"
          placeholder="若不填写则使用全局默认的配置"
        />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">Git密码</label>
      </div>
      <div class="col-9 col-sm-12">
        <input
          class="form-input"
          type="password"
          v-model="data.git_password"
          placeholder="若不填写则使用全局默认的配置"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "git-init-clone",
  computed: {
    ...mapState({
      data: state => state.tools.lgModal.data
    })
  }
};
</script>
