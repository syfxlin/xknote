<template>
  <a
    :class="
      'tile tile-centered' + (status !== 'C' && mode !== 'read' ? ' badge' : '')
    "
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
      <input
        class="form-input"
        type="text"
        placeholder="Name"
        :value="info.name"
      />
    </div>
    <div class="tile-action">
      <button class="btn btn-link btn-action" @click="showNoteSettings($event)">
        <img
          class="icon"
          src="/static/svg/settings.svg"
          v-if="mode !== 'read'"
        />
        <div class="loading"></div>
      </button>
    </div>
  </a>
</template>

<script>
import { mapActions } from "vuex";
import { getFloatItems } from "../menuItem";
export default {
  name: "note-item",
  props: ["info", "status", "storage", "mode"],
  data() {
    return {
      hoverTitle: "文件名: " + this.info.name + "\n路径: " + this.info.path
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
        items: getFloatItems("note", this.storage, {
          storage: this.storage,
          path: this.info.path,
          type: "note",
          currEle: currEle
        })
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
