<template>
  <div :class="'dropdown' + (right ? ' dropdown-right' : '')">
    <div class="btn-group">
      <a
        v-if="mainItem.operate"
        @click="operate(mainItem.operate)"
        :class="'btn' + (mainItem.style ? ' ' + mainItem.style : '')"
      >{{ mainItem.name }}</a>
      <a
        href="#"
        :class="'btn dropdown-toggle' + (mainItem.style ? ' ' + mainItem.style : '')"
        tabindex="0"
      >
        {{ !mainItem.operate ? mainItem.name : '' }}
        <i class="icon icon-caret"></i>
      </a>
      <ul class="menu">
        <li v-for="item in items" :key="item.id" class="menu-item">
          <template v-if="item.operate==='logout'">
            <form action="/logout" method="post">
              <button type="submit">{{ item.name }}</button>
              <input type="hidden" name="_token" :value="csrfToken" />
            </form>
          </template>
          <template v-else-if="item.name!=='divider'">
            <a @click="operate(item.operate)">{{ item.name }}</a>
          </template>

          <template v-else>
            <li class="divider" :data-content="item.content"></li>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "dropdown",
  props: ["items", "mainItem", "operate", "right"],
  data() {
    return {
      csrfToken: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.csrfToken = document.querySelector("meta[name=csrf-token]").content;
    });
  }
};
</script>

<style>
.menu-item button {
  border-radius: 0.1rem;
  color: inherit;
  display: block;
  margin: 0 -0.4rem;
  padding: 0.2rem 0.4rem;
  outline: 0;
  text-decoration: none;
  background-color: transparent;
  border: 0;
  width: calc(100% + 0.8rem);
  text-align: left;
}
.menu-item button:hover {
  background: #f1f1fc;
  color: #5755d9;
}
</style>
