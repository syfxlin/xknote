<template>
  <div :class="'dropdown' + (data.isRight ? ' dropdown-right' : '')">
    <div class="btn-group">
      <a
        v-if="data.operate"
        @click="data.handler()"
        :class="'btn ' + (data.style || '')"
        >{{ data.name }}</a
      >
      <a
        href="#"
        :class="'btn dropdown-toggle ' + (data.style || '')"
        tabindex="0"
      >
        {{ !data.operate ? data.name : "" }}
        <i class="icon icon-caret"></i>
      </a>
      <ul class="menu">
        <li v-for="item in data.items" :key="item.id" class="menu-item">
          <template v-if="item.operate === 'logout'">
            <form action="/logout" method="post">
              <button type="submit">{{ item.name }}</button>
              <input type="hidden" name="_token" :value="csrfToken" />
            </form>
          </template>
          <template v-else-if="item.name !== 'divider'">
            <a @click="item.handler()">{{ item.name }}</a>
          </template>
          <template v-else>
            <div class="divider" :data-content="item.content"></div>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "dropdown",
  props: ["data"],
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
.dropdown .menu-item button {
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
.dropdown .menu-item button:hover {
  background: #f1f1fc;
  color: #5755d9;
}
</style>
