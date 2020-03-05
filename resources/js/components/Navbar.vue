<template>
  <header class="navbar xknote-header">
    <section class="navbar-section col-2 navbar-left">
      <img class="xknote-icon" src="/logo.png" alt="XK-Note icon" />
      <a href="#" class="btn btn-link text-large">{{ xknoteName }}</a>
      <transition name="fade" mode="out-in">
        <button
          class="btn btn-action btn-lg"
          title="开启/关闭侧边栏"
          v-if="isMinScreen || writeMode"
          @click="switchShowSidebar()"
        >
          <i class="icon icon-menu"></i>
        </button>
      </transition>
    </section>
    <section v-show="showNavBarCenter" class="navbar-center">
      <input
        id="xknote-title"
        class="form-input"
        type="text"
        placeholder="Title"
        v-model="xknoteOpened.note.title"
      />
      <dropdown v-for="item in dpCenter" :key="item.id" :data="item" />
      <div class="popover popover-bottom">
        <button class="btn">信息</button>
        <div class="popover-container">
          <div class="card">
            <div class="card-body">
              <p>
                创建时间：
                <span>{{ xknoteOpened.note.created_at }}</span>
              </p>
              <p>
                修改时间：
                <span>{{ xknoteOpened.note.updated_at }}</span>
              </p>
              <p>
                路径：
                <span>{{ xknoteOpened.path }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-show="showNavBarRight" class="navbar-section navbar-right">
      <dropdown :data="dpRight.create" />
      <router-link to="/read" class="btn btn-link">阅读模式</router-link>
      <router-link v-if="!writeMode" to="/write" class="btn btn-link"
        >写作模式</router-link
      >
      <router-link v-if="writeMode" to="/" class="btn btn-link"
        >普通模式</router-link
      >
      <a @click="dpRight.image.handler()" class="btn btn-link">图片</a>
      <dropdown :data="dpRight.config" />
    </section>
    <div class="navbar-center-mbtn">
      <button class="btn btn-action btn-lg" @click="switchShowNavBarCenter()">
        <i class="icon icon-menu"></i>
      </button>
    </div>
    <div class="navbar-right-mbtn">
      <button class="btn btn-action btn-lg" @click="switchShowNavBarRight()">
        <i class="icon icon-menu"></i>
      </button>
    </div>
  </header>
</template>

<script>
import Dropdown from "./Dropdown";
import { mapState, mapActions } from "vuex";
import { getNavItem } from "../menu/nav/index";
export default {
  name: "navbar",
  components: {
    dropdown: Dropdown
  },
  computed: {
    ...mapState("note", ["xknoteOpened"]),
    ...mapState("tools", [
      "writeMode",
      "isMinScreen",
      "showNavBarRight",
      "showNavBarCenter"
    ])
  },
  data() {
    return {
      xknoteName: window.xknote.xknote_name,
      dpCenter: getNavItem("center"),
      dpRight: getNavItem("right")
    };
  },
  methods: {
    ...mapActions("tools", [
      "switchShowSidebar",
      "switchShowNavBarRight",
      "switchShowNavBarCenter"
    ])
  }
};
</script>

<style></style>
