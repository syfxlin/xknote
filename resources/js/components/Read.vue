<template>
  <main class="read-home container">
    <div class="columns">
      <section class="col-9 read-container">
        <header class="hero hero-sm bg-gray read-header">
          <div class="hero-body">
            <h1>Hero title</h1>
            <p>This is a hero example</p>
          </div>
        </header>
        <article class="markdown-body read-content"></article>
        <footer class="xknote-copyright bg-gray read-footer">
          ©
          <a href="https://github.com/syfxlin/xknote">XK-Note</a> By
          <a href="https://ixk.me">Otstar Lin</a>
        </footer>
      </section>
      <aside class="col-3 p-fixed read-sidebar">
        <!-- <ul class="tab tab-block xknote-tab">
          <li class="tab-item">
            <a href="#" :class="xknoteTab==='curr' ? 'active' : ''" @click="switchTab('curr')">当前</a>
          </li>
          <li :class="'tab-item ' + (xknoteTab==='cloud' ? 'active' : '')">
            <a href="#" @click="switchTab('cloud')">云端</a>
          </li>
          <li class="tab-item">
            <a href="#" :class="xknoteTab==='local' ? 'active' : ''" @click="switchTab('local')">本地</a>
          </li>
        </ul>-->
        <!-- <ul class="xknote-tab-content">
          <li v-show="xknoteTab==='curr'">
            <ul class="menu menu-nav">
              <li class="menu-item" v-for="(item, index) in currList" :key="item.id">
                <note-item :info="item" :status="item.status" :index="index" :storage="'curr'" />
              </li>
              <div class="text-gray text-center" v-if="currList.length===0">这里什么都没有哦（￣︶￣）↗</div>
            </ul>
          </li>
          <li v-show="xknoteTab==='cloud'">
            <folder-item
              v-for="(item, index) in cloudList"
              :key="item.id"
              :info="item"
              :index="index"
              :storage="'cloud'"
            />
            <template v-if="cloudList.length===0">
              <div class="loading loading-lg"></div>
              <div class="text-gray text-center">正在加载，客官莫急。</div>
            </template>
          </li>
          <li v-show="xknoteTab==='local'">
            <ul class="menu menu-nav">
              <li class="menu-item" v-for="(item, index) in localList" :key="item.id">
                <note-item :info="item" :status="item.status" :index="index" :storage="'local'" />
              </li>
              <div class="text-gray text-center" v-if="localList.length===0">这里什么都没有哦（￣︶￣）↗</div>
            </ul>
          </li>
        </ul>-->
      </aside>
    </div>
  </main>
</template>

<script>
export default {
  name: "read-mode",
  data() {
    return {};
  }
};
</script>

<style>
.read-sidebar {
  top: 0;
  right: 0;
  height: 100%;
}
.read-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  border-right: 1px solid #ddd;
}
.read-header .hero-body {
  padding: 0.4rem 3rem;
}
.read-content {
  flex: 1;
}
.read-footer {
  padding: 1.5em 0;
}
</style>
