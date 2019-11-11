<template>
  <div class="form-horizontal">
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
        <label class="form-label">存放的文件夹</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.select" required />
        <div v-if="!data.folders">
          <div class="loading"></div>
          <div class="text-gray text-center">正在加载，客官莫急。</div>
        </div>
        <template v-else>
          <hr />
          <only-folder-item v-for="item in data.folders" :key="item.id" :info="item" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import OnlyFolderItem from "../OnlyFolderItem";
export default {
  name: "create-folder",
  components: {
    "only-folder-item": OnlyFolderItem
  },
  computed: {
    ...mapState({
      data: state => state.tools.lgModal.data,
      modal: state => state.tools.lgModal
    })
  },
  methods: {
    ...mapActions("tools", ["setLgModalData", "hideLgModal"]),
    ...mapActions("toast", ["timeToast", "showLoadToast", "hideLoadToast"]),
    ...mapActions("note", ["folderOperate", "listOperate", "loadCloudFolders"])
  },
  created() {
    this.modal.title = "新建文件夹";
    let wTimeout = null;
    let watch = () => {
      if (wTimeout) {
        clearTimeout(wTimeout);
      }
      wTimeout = setTimeout(() => {
        this.setLgModalData({
          ...this.data,
          status: "loading"
        });
        this.folderOperate({
          operate: "exist",
          folderInfo: {
            path: this.data.select + "/" + this.data.foldername
          }
        }).then(data => {
          if (data.exist) {
            this.setLgModalData({
              ...this.data,
              status: "error"
            });
          } else {
            this.setLgModalData({
              ...this.data,
              status: ""
            });
          }
        });
      }, 500);
    };
    let uwFolderName = this.$watch("data.foldername", watch);
    let uwTitle = this.$watch("data.select", watch);
    this.modal.confirm = () => {
      if (!this.data.foldername || this.data.status !== "") {
        return;
      }
      document
        .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
        .classList.add("loading");
      let path = this.data.select + "/" + this.data.foldername;
      this.folderOperate({
        operate: "create",
        folderInfo: {
          path: path
        }
      })
        .then(() => {
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.remove("loading");
          this.modal.cancel();
          this.showLoadToast({ message: "重新读取文件夹列表中..." });
          this.loadCloudFolders()
            .then(() => {
              this.hideLoadToast();
            })
            .catch(err => {
              this.hideLoadToast();
            });
          this.timeToast({
            message: "创建文件夹成功！",
            status: "success",
            delay: 1000
          });
        })
        .catch(err => {
          this.timeToast({
            message: "创建文件夹失败！请重试。",
            status: "error",
            delay: 1000
          });
        });
    };
    this.modal.cancel = () => {
      uwFolderName();
      uwTitle();
      this.hideLgModal();
    };
    this.folderOperate({ operate: "readOnly", folderInfo: null }).then(data => {
      this.setLgModalData({
        ...this.data,
        folders: data.folders
      });
    });
  }
};
</script>
