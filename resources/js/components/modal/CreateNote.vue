<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">文档名</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input
          :class="'form-input' + (data.status === 'error' ? ' is-error' : '')"
          type="text"
          v-model="data.filename"
          required
        />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">标题</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.title" required />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">云端/本地</label>
      </div>
      <div class="col-9 col-sm-12">
        <select class="form-select" v-model="data.storage" required>
          <option value="cloud">云端</option>
          <option value="local">本地</option>
        </select>
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
  name: "create-note",
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
        this.setLgModalData({
          ...this.data,
          status: "loading"
        });
        if (
          !new RegExp(".+\\.(" + window.xknote.document_ext + ")").test(
            this.data.filename
          )
        ) {
          this.setLgModalData({
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
      this.listOperate({
        operate: "add",
        storage: this.data.storage,
        path: path,
        noteInfo: noteInfo
      });
      document
        .querySelector(".xknote-lg-modal .modal-footer .btn-primary")
        .classList.remove("loading");
      this.modal.cancel();
    };
    this.modal.cancel = () => {
      uwFileName();
      uwTitle();
      uwStorage();
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
