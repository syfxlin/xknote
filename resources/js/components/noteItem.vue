<template>
  <a
    :class="'tile tile-centered' + (status!=='C' ? ' badge' : '')"
    :data-badge="status"
    :title="hoverTitle"
    :data-index="index"
    :data-storage="storage"
  >
    <img class="icon" src="/static/svg/file-text.svg" />
    <div class="tile-content">
      <div class="tile-click" @click="openNote()">
        <div class="tile-title text-bold">{{ info.name }}</div>
        <div class="tile-subtitle">{{ info.path }}</div>
      </div>
      <input class="form-input" type="text" placeholder="Name" :value="info.name" />
    </div>
    <div class="tile-action">
      <button class="btn btn-link btn-action" @click="showNoteSettings($event)" v-if="showSetting">
        <img class="icon" src="/static/svg/settings.svg" />
      </button>
    </div>
  </a>
</template>

<script>
export default {
  name: "note-item",
  props: ["info", "status", "index", "storage", "showSetting"],
  data() {
    return {
      hoverTitle: "文件名: " + this.info.name + "\n路径: " + this.info.path,
      home: window.nThis.home,
      app: window.nThis.app,
      floatMenuItems: {
        curr: [
          {
            name: "保存到云端",
            operate: "saveCloud"
          },
          {
            name: "保存到本地",
            operate: "saveLocal"
          },
          {
            name: "重命名",
            operate: "rename"
          },
          {
            name: "导出",
            operate: "download"
          },
          {
            name: "关闭",
            operate: "closeCurr"
          },
          {
            name: "saveAndClose"
          }
        ],
        cloud: [
          {
            name: "重命名",
            operate: "rename"
          },
          {
            name: "删除",
            operate: "delete"
          }
        ],
        local: [
          {
            name: "保存至云端",
            operate: "saveCloud"
          },
          {
            name: "导出",
            operate: "download"
          },
          {
            name: "重命名",
            operate: "rename"
          },
          {
            name: "删除",
            operate: "delete"
          },
          {
            name: "saveAndClose" // TODO: 是否在保存到云端的同时删除本地中的存储
          }
        ]
      }
    };
  },
  methods: {
    showNoteSettings(e) {
      var n = document.getElementsByClassName("float-menu")[0];
      n.style.top = e.clientY + "px";
      n.style.left = e.clientX + "px";
      this.home.floatMenu.show = true;
      this.home.floatMenu.items = this.floatMenuItems[this.storage];
      this.$nextTick(() => {
        var offset = {
          xS: e.clientX,
          yS: e.clientY,
          xE: e.clientX + n.clientWidth,
          yE: e.clientY + n.clientHeight
        };
        e.stopPropagation();
        var closeN = ev => {
          if (
            ev.clientX < offset.xS ||
            ev.clientX > offset.xE ||
            ev.clientY < offset.yS ||
            ev.clientY > offset.yE
          ) {
            this.home.floatMenu.show = false;
          }
          document.removeEventListener("click", closeN);
        };
        document.addEventListener("click", closeN);
      });
      window.xknote.currClickTarget =
        e.target.parentElement.parentElement.parentElement;
    },
    openNote(e) {
      this.app.openNote(this.info, {
        index: this.index,
        storage: this.storage
      });
    }
  }
};
</script>
