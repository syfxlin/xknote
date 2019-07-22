<template>
  <main class="home">
    <header class="navbar xknote-header">
      <section class="navbar-section col-2">
        <img class="xknote-icon" src="https://note.ixk.me/img/logo.png" alt="XK-Note icon" />
        <a href="#" class="btn btn-link text-large">{ XK-Note }</a>
      </section>
      <section class="navbar-center">
        <input class="form-input" type="text" placeholder />
      </section>
      <section class="navbar-section">
        <div class="dropdown">
          <div class="btn-group">
            <a href="#" class="btn btn-primary">新建MD笔记</a>
            <a href="#" class="btn btn-primary dropdown-toggle" tabindex="0">
              <i class="icon icon-caret"></i>
            </a>
            <ul class="menu">
              <li class="menu-item">
                <a href="#">新建文件夹</a>
              </li>
            </ul>
          </div>
        </div>
        <a href="#" class="btn btn-link">阅读模式</a>
        <a href="#" class="btn btn-link">写作模式</a>
        <div class="dropdown dropdown-right">
          <a href="#" class="btn btn-link dropdown-toggle" tabindex="0">
            { name }
            <i class="icon icon-caret"></i>
          </a>
          <ul class="menu">
            <li class="menu-item">
              <a href>个人中心</a>
            </li>
            <li class="menu-item">
              <a href>用户设置</a>
            </li>
            <li class="menu-item">
              <a href>Git设置</a>
            </li>
            <li class="menu-item">
              <a href>系统管理</a>
            </li>
            <li class="divider"></li>
            <li class="menu-item">
              <a href>登出</a>
            </li>
          </ul>
        </div>
      </section>
    </header>
    <div class="columns">
      <section class="column col-2">col-auto</section>
      <section class="column col-10" id="xknote-editor">
        <xk-editor :settingApi="setting" :contentApi="content" />
      </section>
    </div>
  </main>
</template>

<script>
import XK_Editor from "xkeditor";
export default {
  name: "Home",
  components: {
    "xk-editor": XK_Editor
  },
  data() {
    return {
      setting: "/static/setting.json",
      content: "/static/md_content.md"
    };
  },
  methods: {},
  mounted() {}
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}
body {
  margin: 0;
}
p {
  margin: 0;
}
/* 滚动槽 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.06);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.12);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}
#app {
  width: 100%;
  height: 100%;
}
.home {
  height: 100%;
}
.home .columns {
  height: calc(100% - 60px);
  margin: 0;
}
#xknote-editor {
  height: 100%;
  padding: 0px;
}
#xknote-editor .ace-toolbar .xk-button {
  font-size: 0.85em;
}
.xknote-header {
  height: 60px;
  z-index: 100;
  border-bottom: 1px solid #dfdfdf;
  padding: 0 20px 0 0;
}
.xknote-header .btn {
  margin-left: 5px;
}
.xknote-header .btn-link:focus,
.xknote-header .btn-link:hover {
  box-shadow: 0 0 0 0.1rem rgba(87, 85, 217, 0.2);

  text-decoration: none;
}
.xknote-header .btn-link:focus {
  background: #f1f1fc;
}
.xknote-header .navbar-section.col-2 {
  flex: 0 0 auto !important;
  margin-right: 0.3rem;
}
.xknote-icon {
  width: 39px;
  height: 39px;
  margin-left: 20px;
}
</style>
