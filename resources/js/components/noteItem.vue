<template>
  <a
    :class="'tile tile-centered' + (status!=='C'&&mode!=='read' ? ' badge' : '')"
    :data-badge="status"
    :title="hoverTitle"
    :data-index="index"
    :data-storage="storage"
    :data-path="info.path"
  >
    <img class="icon" src="/static/svg/file-text.svg" />
    <div class="tile-content">
      <div class="tile-click" @click="thisOpenNote()">
        <div class="tile-title text-bold">{{ info.name }}</div>
        <div class="tile-subtitle">{{ info.path }}</div>
      </div>
      <input class="form-input" type="text" placeholder="Name" :value="info.name" />
    </div>
    <div class="tile-action">
      <button class="btn btn-link btn-action" @click="showNoteSettings($event)">
        <img class="icon" src="/static/svg/settings.svg" v-if="mode!=='read'" />
        <div class="loading"></div>
      </button>
    </div>
  </a>
</template>

<script>
export default {
  name: "note-item",
  props: [
    "info",
    "status",
    "index",
    "storage",
    "mode",
    "openNote",
    "floatMenu"
  ],
  data() {
    return {
      hoverTitle: "文件名: " + this.info.name + "\n路径: " + this.info.path,
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
            name: "关闭",
            operate: "closeCurr"
          },
          {
            name: "saveAndClose",
            content: "保存后关闭"
          }
        ],
        cloud: [
          {
            name: "保存到本地",
            operate: "saveLocal"
          },
          {
            name: "重命名",
            operate: "rename"
          },
          {
            name: "移动", // TODO: 未完成
            operate: "move"
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
            name: "重命名",
            operate: "rename"
          },
          {
            name: "删除",
            operate: "delete"
          },
          {
            name: "saveAndClose",
            content: "保存后删除"
          }
        ]
      }
    };
  },
  methods: {
    showNoteSettings(e) {
      var currEle = e.target.parentElement.parentElement;
      if (e.target.nodeName === "IMG") {
        currEle = currEle.parentElement;
      }
      var n = document.getElementsByClassName("float-menu")[0];
      n.style.top = e.clientY + "px";
      n.style.left = e.clientX + "px";
      this.floatMenu.show = true;
      this.floatMenu.items = this.floatMenuItems[this.storage];
      this.floatMenu.currData = {
        storage: this.storage,
        index: this.index,
        type: "note",
        currEle: currEle
      };
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
            this.floatMenu.show = false;
          }
          document.removeEventListener("click", closeN);
        };
        document.addEventListener("click", closeN);
      });
    },
    thisOpenNote(e) {
      this.openNote(
        this.info,
        {
          index: this.index,
          storage: this.storage
        },
        this.mode
      );
    }
  }
};
</script>
