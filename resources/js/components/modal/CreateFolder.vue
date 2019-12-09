<template>
  <div class="form-horizontal">
    <form-group :config="data" :k="'foldername'" :info="createFolderInfo" :status="data.status"></form-group>
    <form-group :config="data" :k="'select'" :info="createFolderInfo">
      <div v-if="!data.folders">
        <div class="loading"></div>
        <div class="text-gray text-center">正在加载，客官莫急。</div>
      </div>
      <template v-else>
        <hr />
        <only-folder-item v-for="item in data.folders" :key="item.id" :info="item" />
      </template>
    </form-group>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import OnlyFolderItem from "../OnlyFolderItem";
import FormGroup from "../FormGroup";
import configInfo from "../../utils/configInfo";
export default {
  name: "create-folder",
  components: {
    "only-folder-item": OnlyFolderItem,
    "form-group": FormGroup
  },
  data() {
    return {
      createFolderInfo: configInfo.createFolder
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
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.remove("loading");
          this.timeToast({
            message:
              "创建文件夹失败！请重试。(" + err.response.data.error + ")",
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
