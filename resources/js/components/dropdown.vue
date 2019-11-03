<template>
  <div class="dropdown">
    <div class="btn-group">
      <a
        v-if="mainItem.type === 1"
        @click="operate(mainItem.operate)"
        class="btn"
      >{{ mainItem.name }}</a>
      <a href="#" class="btn dropdown-toggle" tabindex="0">
        {{ mainItem.type === 2 ? mainItem.name : '' }}
        <i class="icon icon-caret"></i>
      </a>
      <ul class="menu">
        <li v-for="item in items" :key="item.id" class="menu-item">
          <a @click="operate(item.operate)">{{ item.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "dropdown",
  props: ["items", "mainItem", "operate"]
};
</script>
