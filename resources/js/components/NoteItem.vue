<template>
  <a
    :class="'tile tile-centered' + (status!=='C'&&mode!=='read' ? ' badge' : '')"
    :data-badge="status"
    :title="hoverTitle"
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
import { mapActions } from "vuex";
export default {
  name: "note-item",
  props: ["info", "status", "storage", "mode"],
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
            name: "移动",
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
    ...mapActions("tools", ["showFloatMenu", "hideFloatMenu"]),
    ...mapActions("note", ["openNote"]),
    showNoteSettings(e) {
      var currEle = e.target.parentElement.parentElement;
      if (e.target.nodeName === "IMG") {
        currEle = currEle.parentElement;
      }
      var n = document.getElementsByClassName("float-menu")[0];
      n.style.top = e.clientY + "px";
      n.style.left = e.clientX + "px";
      this.showFloatMenu({
        items: this.floatMenuItems[this.storage],
        data: {
          storage: this.storage,
          path: this.info.path,
          type: "note",
          currEle: currEle
        }
      });
      this.$nextTick(() => {
        if (n.offsetTop + n.clientHeight > window.innerHeight) {
          n.style.top =
            n.offsetTop -
            (n.offsetTop + n.clientHeight - window.innerHeight) +
            "px";
        }
        if (n.offsetLeft + n.clientWidth > window.innerWidth) {
          n.style.left =
            n.offsetLeft -
            (n.offsetLeft + n.clientWidth - window.innerWidth) +
            "px";
        }
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
            this.hideFloatMenu();
          }
          document.removeEventListener("click", closeN);
        };
        document.addEventListener("click", closeN);
      });
    },
    thisOpenNote(e) {
      this.openNote({
        note: this.info,
        source: {
          path: this.info.path,
          storage: this.storage
        },
        mode: this.mode
      });
    }
  }
};
</script>
