<template>
  <div class="accordion" :data-storage="storage" :data-path="info.path">
    <!-- mark checked代表已经开启 -->
    <input :id="'accordion-' + idHash" type="checkbox" name="accordion-checkbox" hidden />
    <label class="accordion-header c-hand" :for="'accordion-' + idHash" :title="info.path">
      <img class="icon mr-1" src="/static/svg/folder.svg" />
      <span>{{ info.name }}</span>
      <span class="text-gray" v-if="info.git">-Git</span>
      <input class="form-input" type="text" placeholder="Name" :value="info.name" />
      <button
        class="btn btn-link btn-action"
        @click="showFolderSetting($event)"
        v-if="mode!=='read'"
      >
        <img class="icon" src="/static/svg/settings.svg" />
      </button>
    </label>
    <div class="accordion-body">
      <ul class="menu menu-nav">
        <li class="menu-item" v-for="item in info.sub" :key="item.id">
          <note-item
            v-if="item.type==='note'"
            :info="item"
            :status="'C'"
            :storage="storage"
            :mode="mode"
            :openNote="openNote"
            :floatMenu="floatMenu"
          />
          <folder-item
            v-if="item.type==='folder'"
            :info="item"
            :storage="storage"
            :mode="mode"
            :openNote="openNote"
            :floatMenu="floatMenu"
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
  props: ["info", "storage", "mode", "openNote", "floatMenu"],
  data() {
    return {
      idHash: Math.random()
        .toString(36)
        .substring(2, 8),
      floatMenuItems: {
        parent: [
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
          },
          {
            name: "打包导出", // TODO: 未完成
            operate: "downloadFolder"
          },
          {
            name: "divider",
            content: "Git"
          },
          {
            name: "Push", // TODO: 未完成
            operate: "gitPush"
          },
          {
            name: "Pull", // TODO: 未完成
            operate: "gitPull"
          },
          {
            name: "Clone", // TODO: 未完成
            operate: "gitClone"
          },
          {
            name: "Init", // TODO: 未完成
            operate: "gitInit"
          },
          {
            name: "Push force", // TODO: 未完成
            operate: "gitPushForce"
          }
        ],
        children: [
          {
            name: "重命名", // TODO: 未完成
            operate: "rename"
          },
          {
            name: "删除",
            operate: "delete"
          },
          {
            name: "打包导出", // TODO: 未完成
            operate: "downloadFolder"
          }
        ]
      }
    };
  },
  computed: {
    selectMenuItem() {
      if (this.info.path.lastIndexOf("/") === 0) {
        return "parent";
      } else {
        return "children";
      }
    }
  },
  components: {
    "note-item": noteItem
  },
  methods: {
    showFolderSetting(e) {
      var currEle = e.target.parentElement.parentElement;
      if (e.target.nodeName === "IMG") {
        currEle = currEle.parentElement;
      }
      var f = document.getElementsByClassName("float-menu")[0];
      f.style.top = e.clientY + "px";
      f.style.left = e.clientX + "px";
      this.floatMenu.show = true;
      this.floatMenu.items = this.floatMenuItems[this.selectMenuItem];
      this.floatMenu.data = {
        storage: this.storage,
        path: this.info.path,
        type: "folder",
        currEle: currEle
      };
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
          this.floatMenu.show = false;
        }
        document.removeEventListener("click", closeF);
      };
      document.addEventListener("click", closeF);
    }
  }
};
</script>

