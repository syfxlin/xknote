<template>
  <div class="components">
    <ul class="menu float-menu col-1" v-show="floatMenu.show">
      <li class="menu-item" v-for="item in floatMenu.items" :key="item.id">
        <template v-if="item.name==='saveAndClose'">
          <label class="form-switch">
            <input type="checkbox" v-model="floatMenu.saveAndClose" />
            <i class="form-icon"></i>
            {{ item.content }}
          </label>
        </template>
        <template v-else-if="item.name==='divider'">
          <li :data-content="item.content" class="divider"></li>
        </template>
        <a @click="floatMenuOperate(item.operate)" v-else>{{ item.name }}</a>
      </li>
    </ul>
    <modal :data="smModal" :size="'sm'">{{ smModal.content }}</modal>
    <modal :data="lgModal" :size="'lg'">
      <create-note v-if="lgModal.content==='CreateNote'"></create-note>
      <create-folder v-if="lgModal.content==='CreateFolder'"></create-folder>
      <personal-center v-if="lgModal.content==='PersonalCenter'"></personal-center>
      <user-config v-if="lgModal.content==='UserConfig'"></user-config>
      <git-config v-if="lgModal.content==='GitConfig'"></git-config>
      <system-config v-if="lgModal.content==='SystemConfig'"></system-config>
      <check-local-status v-if="lgModal.content==='CheckLocalStatus'"></check-local-status>
      <git-init-clone v-if="lgModal.content==='GitInitClone'"></git-init-clone>
      <git-item-config v-if="lgModal.content==='GitItemConfig'"></git-item-config>
      <move-item v-if="lgModal.content==='MoveItem'"></move-item>
      <image-item v-if="lgModal.content==='ImageItem'"></image-item>
      <git-status v-if="lgModal.content==='GitStatus'"></git-status>
    </modal>
    <modal :data="llgModal" :size="'llg'">
      <note-history v-if="llgModal.content==='NoteHistory'"></note-history>
      <all-note-history v-if="llgModal.content==='AllNoteHistory'"></all-note-history>
    </modal>
    <div :class="'toast toast-' + toast.status">
      <button class="btn btn-clear float-right"></button>
      <p>{{ toast.message }}</p>
    </div>
    <div :class="'toast-progress ' + (loadToast.show ? 'active' : '')">
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
    modal: Modal
  },
  computed: {
    ...mapState("tools", ["smModal", "lgModal", "floatMenu", "llgModal"]),
    ...mapState("toast", ["toast", "loadToast"])
  },
  methods: {
    ...mapActions("menu", ["floatMenuOperate"])
  }
};
</script>
