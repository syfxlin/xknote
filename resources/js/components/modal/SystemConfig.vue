<template>
  <div class="system-config">
    <h4>通用设置</h4>
    <div class="form-horizontal">
      <form-group
        :config="data"
        :k="'enable_register'"
        :info="systemConfigInfo"
        :status="data.status"
      ></form-group>
      <form-group
        :config="data"
        :k="'xknote_name'"
        :info="systemConfigInfo"
        :status="data.status"
      ></form-group>
      <form-group
        :config="data"
        :k="'upload_limit'"
        :info="systemConfigInfo"
        :status="data.status"
      ></form-group>
    </div>
    <h4>用户管理</h4>
    <div v-if="users.length === 0">
      <div class="loading"></div>
      <div class="text-gray text-center">正在加载，客官莫急。</div>
    </div>
    <table v-else class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>昵称</th>
          <th>用户邮箱</th>
          <th>注册时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.nickname }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.created_at }}</td>
          <td>
            <a
              v-if="user.id != 1"
              @click="thisDeleteUser(user.id)"
              class="btn btn-link"
              :id="'users-' + user.id"
              style="padding: 0;height: auto;"
              >删除</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FormGroup from "../FormGroup";
import configInfo from "../../utils/configInfo";
export default {
  name: "system-config",
  components: {
    "form-group": FormGroup
  },
  computed: {
    ...mapState({
      data: state => state.tools.miModal.data,
      modal: state => state.tools.miModal
    })
  },
  data() {
    return {
      users: [],
      systemConfigInfo: configInfo.systemConfig
    };
  },
  methods: {
    ...mapActions("tools", ["setMiModalData", "hideMiModal"]),
    ...mapActions("conf", ["configOperate"]),
    ...mapActions("toast", ["timeToast"]),
    ...mapActions("user", ["getAllUser", "deleteUser"]),
    thisDeleteUser(id) {
      document.getElementById("users-" + id).classList.add("loading");
      this.deleteUser(id)
        .then(() => {
          this.users.splice(
            this.users.findIndex(item => {
              return item.id === id;
            }),
            1
          );
          this.timeToast({
            message: "删除成功！",
            status: "success",
            delay: 1000
          });
        })
        .catch(err => {
          document.getElementById("users-" + id).classList.remove("loading");
          this.timeToast({
            message: "删除失败！(" + err.response.data.error + ")",
            status: "error",
            delay: 1000
          });
        });
    }
  },
  created() {
    this.modal.title = "系统设置";
    this.setMiModalData({
      ...this.data,
      status: "loading"
    });
    this.configOperate({
      operate: "getSystemConfig",
      config: null
    })
      .then(info => {
        this.setMiModalData({
          ...this.data,
          status: "",
          enable_register: info.enable_register,
          xknote_name: info.xknote_name,
          upload_limit: info.upload_limit
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
        !this.data.upload_limit ||
        !this.data.xknote_name ||
        this.data.status !== ""
      ) {
        return;
      }
      document
        .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
        .classList.add("loading");
      this.configOperate({
        operate: "setSystemConfig",
        config: {
          upload_limit: this.data.upload_limit,
          xknote_name: this.data.xknote_name,
          enable_register: this.data.enable_register
        }
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
    this.getAllUser().then(users => {
      this.users = users;
    });
  }
};
</script>
