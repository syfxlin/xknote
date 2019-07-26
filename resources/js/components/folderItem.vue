<template>
  <div class="accordion" :data-index="index" :data-storage="storage">
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
          <note-item
            v-if="item.type==='note'"
            :info="item"
            :status="'C'"
            :index="index + ':' + i"
            :storage="storage"
          />
          <folder-item
            v-if="item.type==='folder'"
            :info="item"
            :index="index + ':' + i"
            :storage="storage"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import noteItem from "./noteItem.vue";
export default {
  name: "folder-item",
  props: ["info", "index", "storage"],
  data() {
    return {
      idHash: Math.random()
        .toString(36)
        .substring(2, 8),
      home: this.$root.$children[0],
      floatMenuItems: {
        curr: [
          {
            name: "重命名",
            operate: "rename"
          },
          {
            name: "删除",
            operate: "delete"
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
            name: "重命名",
            operate: "rename"
          },
          {
            name: "删除",
            operate: "delete"
          }
        ]
      }
    };
  },
  components: {
    "note-item": noteItem
  },
  methods: {
    showFolderSetting(e) {
      var f = document.getElementsByClassName("float-menu")[0];
      f.style.top = e.clientY + "px";
      f.style.left = e.clientX + "px";
      this.home.floatMenu.show = true;
      this.home.floatMenu.items = this.floatMenuItems[this.storage];
      var offset = {
        xS: e.clientX,
        yS: e.clientY,
        xE: e.clientX + f.clientWidth,
        yE: e.clientY + f.clientHeight
      };
      e.stopPropagation();
      var closeF = ev => {
        if (
          ev.clientX < offset.xS ||
          ev.clientX > offset.xE ||
          ev.clientY < offset.yS ||
          ev.clientY > offset.yE
        ) {
          this.home.floatMenu.show = false;
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

