<template>
  <main class="home">
    <nav class="col-md-12 navbar" id="xknote-menu" role="navigation">
      <div class="container-fluid row xknote-menu-inner">
        <ul class="nav navbar-nav xknote-left-nav col-md-2">
          <li>
            <img class="xknote-icon" src="https://note.ixk.me/img/logo.png" alt="XK-Note icon" />
          </li>
          <li>
            <a href>XK-Note</a>
          </li>
        </ul>
        <ul class="nav navbar-nav xknote-center-nav col-md-5">
          <li>
            <a href>XK-Note</a>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right xknote-right-nav">
          <li>
            <div class="btn-group">
              <button type="button" class="btn btn-primary">新建MD笔记</button>
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-primary dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <span class="caret"></span>
                  <span class="sr-only">新建MD笔记</span>
                </button>
                <ul class="dropdown-menu" role="menu">
                  <li>
                    <a href="#">新建文件夹</a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            <a href>写作模式</a>
          </li>
          <li>
            <a href>阅读模式</a>
          </li>
          <li class="dropdown">
            <a href class="dropdown-toggle" data-toggle="dropdown">
              { name }
              <b class="caret"></b>
            </a>
            <ul class="dropdown-menu" role="menu">
              <li>
                <a href>个人中心</a>
              </li>
              <li>
                <a href>用户设置</a>
              </li>
              <li>
                <a href>Git设置</a>
              </li>
              <li>
                <a href>系统管理</a>
              </li>
              <li class="divider"></li>
              <li>
                <a href>登出</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
    <aside class="col-md-2" id="xknote-sidebar"></aside>
    <section class="col-md-10" id="xknote-editor">
      <xk-editor :settingApi="setting" :contentApi="content" />
    </section>
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
body {
  background-color: #fff;
  color: #3f536e;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica,
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1",
    Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

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
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.12);
  -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}
#app {
  width: 100%;
  height: 100%;
}
.home {
  height: 100%;
}
#xknote-menu {
  height: 65px;
  margin: 0px;
}
#xknote-menu .xknote-menu-inner {
  transform: translateY(-50%);
  top: 50%;
  position: relative;
  z-index: 1000;
}
#xknote-editor {
  height: calc(100% - 65px);
  border: 1px solid #ddd;
  padding: 0px;
}
.dropdown-menu {
  background: #fff !important;
}
.xknote-left-nav {
  font-size: 23px;
  min-width: 16%;
}
.xknote-left-nav .xknote-icon {
  width: 39px;
  height: 39px;
}
.xknote-left-nav li a {
  color: #145ccd;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1);
}
.xknote-left-nav li a:hover {
  color: #0d3d88;
}
.xknote-left-nav,
.xknote-center-nav,
.xknote-right-nav {
  display: flex;
  align-items: center;
}
</style>
