<template>
  <div class="components">
    <ul class="menu float-menu col-1" v-show="floatMenu.show">
      <li class="menu-item" v-for="item in floatMenu.items" :key="item.id">
        <template v-if="item.name === 'saveAndClose'">
          <label class="form-switch">
            <input type="checkbox" v-model="floatMenu.saveAndClose" />
            <i class="form-icon"></i>
            {{ item.content }}
          </label>
        </template>
        <template v-else-if="item.name === 'divider'">
          <li :data-content="item.content" class="divider"></li>
        </template>
        <a @click="floatMenuOperate(item.operate)" v-else>{{ item.name }}</a>
      </li>
    </ul>
    <modal :data="smModal" :size="'sm'">{{ smModal.operate }}</modal>
    <modal :data="miModal" :size="'mi'">
      <create-note v-if="miModal.operate === 'CreateNote'"></create-note>
      <create-folder v-if="miModal.operate === 'CreateFolder'"></create-folder>
      <personal-center
        v-if="miModal.operate === 'PersonalCenter'"
      ></personal-center>
      <user-config v-if="miModal.operate === 'UserConfig'"></user-config>
      <git-config v-if="miModal.operate === 'GitConfig'"></git-config>
      <system-config v-if="miModal.operate === 'SystemConfig'"></system-config>
      <check-local-status
        v-if="miModal.operate === 'CheckLocalStatus'"
      ></check-local-status>
      <git-init-clone
        v-if="miModal.operate === 'GitInitClone'"
      ></git-init-clone>
      <git-item-config
        v-if="miModal.operate === 'GitItemConfig'"
      ></git-item-config>
      <move-item v-if="miModal.operate === 'MoveItem'"></move-item>
      <image-item v-if="miModal.operate === 'ImageItem'"></image-item>
      <git-status v-if="miModal.operate === 'GitStatus'"></git-status>
      <blog-config v-if="miModal.operate === 'BlogConfig'"></blog-config>
      <push-blog v-if="miModal.operate === 'PushBlog'"></push-blog>
    </modal>
    <modal :data="lgModal" :size="'lg'">
      <note-history v-if="lgModal.operate === 'NoteHistory'"></note-history>
      <all-note-history
        v-if="lgModal.operate === 'AllNoteHistory'"
      ></all-note-history>
    </modal>
    <transition name="fade">
      <div :class="'toast toast-' + toast.status" v-show="toast.message">
        <button class="btn btn-clear float-right"></button>
        <p>{{ toast.message }}</p>
      </div>
    </transition>
    <div :class="'toast-progress ' + (loadToast.message ? 'active' : '')">
      <div class="loading"></div>
      <p>{{ loadToast.message }}</p>
    </div>
  </div>
</template>

<script>
import CreateNote from "./modal/CreateNote";
import CreateFolder from "./modal/CreateFolder";
import UserConfig from "./modal/UserConfig";
import GitConfig from "./modal/GitConfig";
import CheckLocalStatus from "./modal/CheckLocalStatus";
import GitInitClone from "./modal/GitInitClone";
import GitItemConfig from "./modal/GitItemConfig";
import SystemConfig from "./modal/SystemConfig";
import PersonalCenter from "./modal/PersonalCenter";
import MoveItem from "./modal/MoveItem";
import ImageItem from "./modal/ImageItem";
import NoteHistory from "./modal/NoteHistory";
import GitStatus from "./modal/GitStatus";
import AllNoteHistory from "./modal/AllNoteHistory";
import BlogConfig from "./modal/BlogConfig";
import PushBlog from "./modal/PushBlog";
import Modal from "./Modal";
import { mapState, mapActions } from "vuex";
export default {
  name: "tools",
  components: {
    "create-note": CreateNote,
    "create-folder": CreateFolder,
    "user-config": UserConfig,
    "git-config": GitConfig,
    "check-local-status": CheckLocalStatus,
    "git-init-clone": GitInitClone,
    "git-item-config": GitItemConfig,
    "system-config": SystemConfig,
    "personal-center": PersonalCenter,
    "move-item": MoveItem,
    "image-item": ImageItem,
    "note-history": NoteHistory,
    "git-status": GitStatus,
    "all-note-history": AllNoteHistory,
    "blog-config": BlogConfig,
    "push-blog": PushBlog,
    modal: Modal
  },
  computed: {
    ...mapState("tools", ["smModal", "miModal", "floatMenu", "lgModal"]),
    ...mapState("toast", ["toast", "loadToast"])
  },
  methods: {
    ...mapActions("menu", ["floatMenuOperate"])
  }
};
</script>
