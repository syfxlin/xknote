<template>
  <a
    :class="'tile tile-centered' + (badge ? ' badge' : '')"
    :data-badge="badge"
    :title="hoverTitle"
    :data-index="index"
  >
    <img class="icon" src="/static/svg/file-text.svg" />
    <div class="tile-content">
      <div class="tile-title text-bold">{{ info.name }}</div>
      <div class="tile-subtitle">{{ info.path }}</div>
    </div>
    <div class="tile-action">
      <button class="btn btn-link btn-action" @click="showNoteSettings($event)">
        <img class="icon" src="/static/svg/settings.svg" />
      </button>
    </div>
  </a>
</template>

<script>
export default {
  name: "note-item",
  props: ["info", "badge", "index"],
  data() {
    return {
      hoverTitle: "文件名: " + this.info.name + "\n路径: " + this.info.path
    };
  },
  methods: {
    showNoteSettings(e) {
      var n = document.getElementsByClassName("note-settings")[0];
      n.style.top = e.clientY + "px";
      n.style.left = e.clientX + "px";
      n.classList.remove("d-none");
      var offset = {
        xS: e.clientX,
        yS: e.clientY,
        xE: e.clientX + n.clientWidth,
        yE: e.clientY + n.clientHeight
      };
      e.stopPropagation();
      var closeN = function(ev) {
        if (
          ev.clientX < offset.xS ||
          ev.clientX > offset.xE ||
          ev.clientY < offset.yS ||
          ev.clientY > offset.yE
        ) {
          n.classList.add("d-none");
        }
        document.removeEventListener("click", closeN);
      };
      document.addEventListener("click", closeN);
      window.xknote.currClickTarget =
        e.target.parentElement.parentElement.parentElement;
    }
  }
};
</script>
