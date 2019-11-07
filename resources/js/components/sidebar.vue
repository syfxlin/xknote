<template>
  <transition name="fade" mode="out-in">
    <section
      :class="'column col-2 xknote-sidebar' + (!writeMode ? '' : ' write-mode')"
      v-show="!writeMode||showSidebar"
    >
      <ul class="tab tab-block xknote-tab">
        <li class="tab-item">
          <!-- mark data-badge: 当前未保存的文章数量 -->
          <a
            :class="(currBadgeCount!==0 ? 'badge ' : '') + (xknoteTab==='curr' ? 'active' : '')"
            :data-badge="currBadgeCount"
            @click="switchTab('curr')"
          >当前</a>
        </li>
        <li :class="'tab-item ' + (xknoteTab==='cloud' ? 'active' : '')">
          <a @click="switchTab('cloud')">云端</a>
        </li>
        <li class="tab-item">
          <!-- mark data-badge: 未保存到云端的数量 -->
          <a
            :class="(localBadgeCount!==0 ? 'badge ' : '') + (xknoteTab==='local' ? 'active' : '')"
            :data-badge="localBadgeCount"
            @click="switchTab('local')"
          >本地</a>
        </li>
      </ul>
      <ul class="xknote-tab-content">
        <li v-show="xknoteTab==='curr'" class="curr-tab">
          <ul class="menu menu-nav">
            <li class="menu-item" v-for="item in currList" :key="item.id">
              <!-- mark data-badge: N为未保存，L为已经保存到本地，若已经保存到云端则不显示badge -->
              <note-item :info="item" :status="item.status" :storage="'curr'" :mode="'normal'" />
            </li>
            <div class="text-gray text-center" v-if="currList.length===0">这里什么都没有哦（￣︶￣）↗</div>
          </ul>
        </li>
        <li v-show="xknoteTab==='cloud'" class="cloud-tab">
          <folder-item
            v-for="item in cloudList"
            :key="item.id"
            :info="item"
            :storage="'cloud'"
            :mode="'normal'"
          />
          <div class="cloud-tab-loading" v-if="cloudList.length===0">
            <div class="loading loading-lg"></div>
            <div class="text-gray text-center">正在加载，客官莫急。</div>
          </div>
        </li>
        <li v-show="xknoteTab==='local'" class="local-tab">
          <ul class="menu menu-nav">
            <li class="menu-item" v-for="item in localList" :key="item.id">
              <!-- mark data-badge: N为未保存，L为已经保存到本地，若已经保存到云端则不显示(C)badge -->
              <note-item :info="item" :status="item.status" :storage="'local'" :mode="'normal'" />
            </li>
            <button
              @click="checkLocalStatus()"
              class="btn xknote-check-local"
              title="对比本地笔记和云端笔记的时间差别"
            >检查状态</button>
            <div class="text-gray text-center" v-if="localList.length===0">这里什么都没有哦（￣︶￣）↗</div>
          </ul>
        </li>
      </ul>
      <div class="xknote-copyright bg-gray">
        ©
        <a href="https://github.com/syfxlin/xknote">XK-Note</a> By
        <a href="https://ixk.me">Otstar Lin</a>
      </div>
    </section>
  </transition>
</template>

<script>
import NoteItem from "./NoteItem";
import FolderItem from "./FolderItem";
import { mapState, mapActions } from "vuex";
export default {
  name: "sidebar",
  components: {
    "note-item": NoteItem,
    "folder-item": FolderItem
  },
  computed: {
    ...mapState("note", [
      "currList",
      "cloudList",
      "localList",
      "xknoteTab",
      "currBadgeCount",
      "localBadgeCount"
    ]),
    ...mapState("tools", ["writeMode", "showSidebar"])
  },
  methods: {
    ...mapActions("note", ["switchTab"]),
    ...mapActions("other", ["checkLocalStatus"])
  }
};
</script>
