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
          <template v-if="item.name!=='divider'">
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
  props: ["items", "mainItem", "operate", "right"]
};
</script>
