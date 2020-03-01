<template>
  <div class="form-horizontal">
    <form-group :config="data" :k="'select'" :info="moveItemInfo" :status="data.status"></form-group>
    <div class="form-group">
      <div class="col-3 col-sm-12"></div>
      <div class="col-9 col-sm-12 has-icon-right">
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
import { mapActions, mapState } from "vuex";
import OnlyFolderItem from "../OnlyFolderItem";
import FormGroup from "../FormGroup";
import configInfo from "../../utils/configInfo";
export default {
  name: "move-item",
  components: {
    "only-folder-item": OnlyFolderItem,
    "form-group": FormGroup
  },
  data() {
    return {
      moveItemInfo: configInfo.moveItem
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
    ...mapActions("toast", ["timeToast", "showLoadToast"]),
    ...mapActions("note", [
      "noteOperate",
      "folderOperate",
      "listOperate",
      "loadCloudFolders"
    ])
  },
  created() {
    let type = this.data.type;
    let oldPath = this.data.path;
    let name = oldPath.substring(oldPath.lastIndexOf("/") + 1);
    this.modal.title = "移动" + (type === "note" ? "笔记" : "文件夹") + "到";
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
        let operatePro;
        if (type === "note") {
          operatePro = this.noteOperate({
            operate: "exist",
            storage: this.data.storage,
            noteInfo: {
              path: this.data.select + "/" + name
            }
          });
        } else {
          operatePro = this.folderOperate({
            operate: "exist",
            folderInfo: {
              path: this.data.select + "/" + name
            }
          });
        }
        operatePro.then(data => {
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
    let uwFolder = this.$watch("data.select", watch);
    this.modal.confirm = () => {
      if (!this.data.select || this.data.status !== "") {
        return;
      }
      document
        .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
        .classList.add("loading");
      let operatePro;
      if (type === "note") {
        operatePro = this.noteOperate({
          operate: "move",
          storage: this.data.storage,
          noteInfo: {
            oldPath: oldPath,
            newPath: this.data.select + "/" + name
          }
        });
      } else {
        operatePro = this.folderOperate({
          operate: "move",
          folderInfo: {
            oldPath: oldPath,
            newPath: this.data.select + "/" + name
          }
        });
      }
      operatePro
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
            message: "移动成功！",
            status: "success",
            delay: 1000
          });
        })
        .catch(err => {
          document
            .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
            .classList.remove("loading");
          this.timeToast({
            message: "移动失败！请重试。(" + err.response.data.error + ")",
            status: "error",
            delay: 1000
          });
        });
    };
    this.modal.cancel = () => {
      uwFolder();
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
