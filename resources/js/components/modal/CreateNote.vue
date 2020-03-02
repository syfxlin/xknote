<template>
  <div class="form-horizontal">
    <form-group
      :config="data"
      :k="'filename'"
      :info="createNoteInfo"
      :status="data.status"
    ></form-group>
    <form-group :config="data" :k="'title'" :info="createNoteInfo"></form-group>
    <form-group
      :config="data"
      :k="'storage'"
      :info="createNoteInfo"
    ></form-group>
    <form-group :config="data" :k="'select'" :info="createNoteInfo">
      <div v-if="!data.folders">
        <div class="loading"></div>
        <div class="text-gray text-center">正在加载，客官莫急。</div>
      </div>
      <template v-else>
        <hr />
        <only-folder-item
          v-for="item in data.folders"
          :key="item.id"
          :info="item"
        />
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
  name: "create-note",
  components: {
    "only-folder-item": OnlyFolderItem,
    "form-group": FormGroup
  },
  data() {
    return {
      createNoteInfo: configInfo.createNote
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
    ...mapActions("toast", ["timeToast"]),
    ...mapActions("note", [
      "noteOperate",
      "folderOperate",
      "listOperate",
      "openNote"
    ])
  },
  created() {
    this.modal.title = "新建MD笔记";
    let wTimeout = null;
    let watch = () => {
      if (wTimeout) {
        clearTimeout(wTimeout);
      }
      wTimeout = setTimeout(() => {
        this.setMiModalData({
          ...this.data,
          status: "loading"
        });
        if (
          !new RegExp(".+\\.(" + window.xknote.document_ext + ")").test(
            this.data.filename
          )
        ) {
          this.setMiModalData({
            ...this.data,
            status: "error"
          });
          return;
        }
        this.noteOperate({
          operate: "exist",
          storage: this.data.storage,
          noteInfo: {
            path: this.data.select + "/" + this.data.filename
          }
        }).then(data => {
          if (data.exist) {
            this.setMiModalData({
              ...this.data,
              status: "error"
            });
          } else {
            this.setMiModalData({
              ...this.data,
              status: ""
            });
          }
        });
      }, 500);
    };
    let uwFileName = this.$watch("data.filename", watch);
    let uwTitle = this.$watch("data.select", watch);
    let uwStorage = this.$watch("data.storage", watch);
    this.modal.confirm = () => {
      if (
        !this.data.filename ||
        !this.data.title ||
        !this.data.storage ||
        this.data.status !== ""
      ) {
        return;
      }
      document
        .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
        .classList.add("loading");
      let d = new Date();
      let date =
        d.getFullYear() +
        "/" +
        (d.getMonth() + 1) +
        "/" +
        d.getDate() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds();
      let path = this.data.select + "/" + this.data.filename;
      let noteInfo = {
        type: "note",
        path: path,
        name: this.data.filename,
        status: "N",
        note: {
          title: this.data.title,
          created_at: date,
          updated_at: date,
          author: "",
          content: ""
        }
      };
      this.openNote({
        note: noteInfo,
        source: {
          path: path,
          storage: this.data.storage
        },
        mode: "normal",
        isNew: true
      });
      // this.listOperate({
      //   operate: "add",
      //   storage: this.data.storage,
      //   path: path,
      //   noteInfo: noteInfo
      // });
      document
        .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
        .classList.remove("loading");
      this.modal.cancel();
    };
    this.modal.cancel = () => {
      uwFileName();
      uwTitle();
      uwStorage();
      this.hideMiModal();
    };
    this.folderOperate({ operate: "readOnly", folderInfo: null }).then(data => {
      this.setMiModalData({
        ...this.data,
        folders: data.folders
      });
    });
  }
};
</script>
