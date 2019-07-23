<template>
  <main class="home">
    <header class="navbar xknote-header">
      <section class="navbar-section col-2">
        <img class="xknote-icon" src="https://note.ixk.me/img/logo.png" alt="XK-Note icon" />
        <a href="#" class="btn btn-link text-large">{ XK-Note }</a>
      </section>
      <section class="navbar-center">
        <input class="form-input" type="text" placeholder="Title" />
        <div class="dropdown">
          <div class="btn-group">
            <a href="#" class="btn">云端保存</a>
            <a href="#" class="btn dropdown-toggle" tabindex="0">
              <i class="icon icon-caret"></i>
            </a>
            <ul class="menu">
              <li class="menu-item">
                <a href="#">本地保存</a>
              </li>
              <li class="menu-item">
                <a href="#">全部保存到云端</a>
              </li>
              <li class="menu-item">
                <a href="#">全部保存到本地</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="dropdown">
          <div class="btn-group">
            <a href="#" class="btn dropdown-toggle" tabindex="0">
              导出
              <i class="icon icon-caret"></i>
            </a>
            <ul class="menu">
              <li class="menu-item">
                <a href="#">导出为Markdown文件</a>
              </li>
              <li class="menu-item">
                <a href="#">导出HTML文件</a>
              </li>
              <li class="menu-item">
                <a href="#">导出带样式的HTML文件</a>
              </li>
              <li class="menu-item">
                <a href="#">导出阅读模式的HTML文件</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="dropdown">
          <div class="btn-group">
            <a href="#" class="btn dropdown-toggle" tabindex="0">
              操作
              <i class="icon icon-caret"></i>
            </a>
            <ul class="menu">
              <li class="divider" data-content="Git"></li>
              <li class="menu-item">
                <a href="#">Push</a>
              </li>
              <li class="menu-item">
                <a href="#">Pull</a>
              </li>
              <li class="menu-item">
                <a href="#">Clone</a>
              </li>
              <li class="menu-item">
                <a href="#">Init</a>
              </li>
              <li class="menu-item">
                <a href="#">Push force</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="popover popover-bottom">
          <button class="btn">信息</button>
          <div class="popover-container">
            <div class="card">
              <div class="card-body">
                <p>
                  创建时间：
                  <span>{ createTime }</span>
                </p>
                <p>
                  修改时间：
                  <span>{ updateTime }</span>
                </p>
                <p>
                  路径：
                  <span>{ path }</span>
                </p>
              </div>
            </div>
          </div>
        </div>
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
      <section class="column col-2">
        <ul class="tab tab-block xknote-tab">
          <li class="tab-item">
            <!-- mark data-badge: 当前未保存的文章数量 -->
            <a href="#" class="badge" data-badge="2" @click="switchTab('curr', $event)">当前</a>
          </li>
          <li class="tab-item active">
            <a href="#" @click="switchTab('cloud', $event)">云端</a>
          </li>
          <li class="tab-item">
            <!-- mark data-badge: 未保存到云端的数量 -->
            <a href="#" class="badge" data-badge="9" @click="switchTab('local', $event)">本地</a>
          </li>
        </ul>
        <ul class="xknote-tab-content">
          <li id="tab-item-curr" class="d-none">
            <ul class="menu menu-nav">
              <li class="menu-item">
                <!-- mark data-badge: N为未保存，L为已经保存到本地，若已经保存到云端则不显示badge -->
                <a class="tile tile-centered badge" data-badge="N">
                  <img class="icon" src="/static/svg/file-text.svg" />
                  <div class="tile-content">
                    <div class="tile-title text-bold">{ noteName }</div>
                    <div class="tile-subtitle">{ notePath }</div>
                  </div>
                  <div class="tile-action">
                    <button class="btn btn-link btn-action">
                      <img class="icon" src="/static/svg/settings.svg" />
                    </button>
                  </div>
                </a>
              </li>
            </ul>
          </li>
          <li id="tab-item-cloud">
            <div class="accordion">
              <!-- mark checked代表已经开启 -->
              <input id="accordion-1" type="checkbox" name="accordion-checkbox" checked hidden />
              <label class="accordion-header c-hand" for="accordion-1">
                <img class="icon mr-1" src="/static/svg/folder.svg" />
                <span>{ folderName }</span>
                <button class="btn btn-link btn-action">
                  <img class="icon" src="/static/svg/settings.svg" />
                </button>
              </label>
              <div class="accordion-body">
                <ul class="menu menu-nav">
                  <li class="menu-item">
                    <a class="tile tile-centered">
                      <img class="icon" src="/static/svg/file-text.svg" />
                      <div class="tile-content">
                        <div class="tile-title text-bold">{ noteName }</div>
                        <div class="tile-subtitle">{ notePath }</div>
                      </div>
                      <div class="tile-action">
                        <button class="btn btn-link btn-action">
                          <img class="icon" src="/static/svg/settings.svg" />
                        </button>
                      </div>
                    </a>
                  </li>
                  <li class="menu-item">
                    <div class="accordion">
                      <input id="accordion-2" type="checkbox" name="accordion-checkbox" hidden />
                      <label class="accordion-header c-hand" for="accordion-2">
                        <img class="icon mr-1" src="/static/svg/folder.svg" />
                        <span>{ folderName }</span>
                        <button class="btn btn-link btn-action">
                          <img class="icon" src="/static/svg/settings.svg" />
                        </button>
                      </label>
                      <div class="accordion-body">
                        <ul class="menu menu-nav">
                          <li class="menu-item">
                            <a class="tile tile-centered">
                              <img class="icon" src="/static/svg/file-text.svg" />
                              <div class="tile-content">
                                <div class="tile-title text-bold">{ noteName }</div>
                                <div class="tile-subtitle">{ notePath }</div>
                              </div>
                              <div class="tile-action">
                                <button class="btn btn-link btn-action">
                                  <img class="icon" src="/static/svg/settings.svg" />
                                </button>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li id="tab-item-local" class="d-none">
            <ul class="menu menu-nav">
              <li class="menu-item">
                <!-- mark data-badge: N为未保存，L为已经保存到本地，若已经保存到云端则不显示badge -->
                <a class="tile tile-centered badge" data-badge="N">
                  <img class="icon" src="/static/svg/file-text.svg" />
                  <div class="tile-content">
                    <div class="tile-title text-bold">{ noteName }</div>
                    <div class="tile-subtitle">{ notePath }</div>
                  </div>
                  <div class="tile-action">
                    <button class="btn btn-link btn-action">
                      <img class="icon" src="/static/svg/settings.svg" />
                    </button>
                  </div>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </section>
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
  methods: {
    switchTab(tabName, e) {
      document
        .querySelector(".xknote-tab > .active")
        .classList.remove("active");
      e.target.parentElement.classList.add("active");
      var tabId = "tab-item-" + tabName;
      document.querySelector(
        ".xknote-tab-content > li:not(.d-none)"
      ).className = "d-none";
      document.getElementById(tabId).className = "";
    }
  },
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
.xknote-header .form-input {
  width: auto;
}
/* Fix xknote-header button hover and active color */
.dropdown .btn-group a:not(.btn-primary):hover {
  color: #5755d9;
}
.dropdown .btn-group a:not(.btn-primary):active {
  color: #5755d9;
  background: #f1f1fc;
  border-color: #4b48d6;
}
.xknote-icon {
  width: 39px;
  height: 39px;
  margin-left: 20px;
}
.xknote-tab-content {
  margin: 0.4rem;
}
.xknote-tab-content li {
  list-style: none;
}
.xknote-tab-content .menu {
  padding: 0;
}
.xknote-tab-content .menu .menu-item {
  padding-right: 0;
}
/* Fix tab tile */
.xknote-tab-content .menu-item > a.tile {
  display: flex;
}
.xknote-tab-content .tile.badge:after {
  transform: none;
}
.xknote-tab-content .tile-content {
  pointer-events: none;
}
.xknote-tab-content .tile-action {
  display: none;
}
.xknote-tab-content .tile:hover .tile-action {
  display: block;
}

.xknote-tab-content .accordion .accordion-header .icon {
  transform: none !important;
}
.xknote-tab-content .tile-subtitle,
.xknote-tab-content .tile-title {
  line-height: 1rem;
  font-size: 0.67rem;
}
.xknote-tab-content .accordion-header {
  padding: 0.2rem 0;
  display: flex;
  align-items: center;
}
.xknote-tab-content .accordion-header span {
  flex: 1 1 auto;
}
.xknote-tab-content .accordion-header button {
  flex: 0 0 auto;
  display: none;
}
.xknote-tab-content .accordion-header:hover button {
  display: block;
  width: 1.8em;
  height: 1.5em;
  padding: 0;
  margin-right: 0.2rem;
}
.xknote-tab-content .accordion-header:hover button img {
  vertical-align: auto;
}
.xknote-tab-content .accordion-body .menu {
  border-left: 3.5px solid #5755d940;
  padding-left: 0.2rem;
  margin-left: 0.3rem;
  border-radius: 0;
}
</style>
