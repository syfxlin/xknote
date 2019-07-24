<template>
  <div class="accordion" :data-index="index">
    <!-- mark checked代表已经开启 -->
    <input :id="'accordion-' + idHash" type="checkbox" name="accordion-checkbox" hidden />
    <label class="accordion-header c-hand" :for="'accordion-' + idHash">
      <img class="icon mr-1" src="/static/svg/folder.svg" />
      <span>{{ info.name }}</span>
      <button class="btn btn-link btn-action" @click="showFolderSetting($event)">
        <img class="icon" src="/static/svg/settings.svg" />
      </button>
    </label>
    <div class="accordion-body">
      <ul class="menu menu-nav">
        <li class="menu-item" v-for="(item, i) in info.sub" :key="item.id">
          <note-item v-if="item.type==='note'" :info="item" :badge="null" :index="index + ':' + i" />
          <folder-item v-if="item.type==='folder'" :info="item" :index="index + ':' + i" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import noteItem from "./noteItem.vue";
export default {
  name: "folder-item",
  props: ["info", "index"],
  data() {
    return {
      idHash: Math.random()
        .toString(36)
        .substring(2, 8)
    };
  },
  components: {
    "note-item": noteItem
  },
  methods: {
    showFolderSetting(e) {
      var f = document.getElementsByClassName("folder-settings")[0];
      f.style.top = e.clientY + "px";
      f.style.left = e.clientX + "px";
      f.classList.remove("d-none");
      var offset = {
        xS: e.clientX,
        yS: e.clientY,
        xE: e.clientX + f.clientWidth,
        yE: e.clientY + f.clientHeight
      };
      e.stopPropagation();
      var closeF = function(ev) {
        if (
          ev.clientX < offset.xS ||
          ev.clientX > offset.xE ||
          ev.clientY < offset.yS ||
          ev.clientY > offset.yE
        ) {
          f.classList.add("d-none");
        }
        document.removeEventListener("click", closeF);
      };
      document.addEventListener("click", closeF);
      window.xknote.currClickTarget =
        e.target.parentElement.parentElement.parentElement;
    }
  }
};
</script>

