<template>
  <div class="accordion only-folder-item">
    <input :id="'accordion-' + idHash" type="checkbox" name="accordion-checkbox" hidden />
    <div
      :class="'accordion-header c-hand' + (isActive ? ' active' : '')"
      :title="info.path"
      @click="select()"
    >
      <label
        :for="'accordion-' + idHash"
        :class="'icon mr-1' + (info.sub.length !== 0 ? ' icon-arrow-right' : '')"
        @click="$event.stopPropagation()"
      ></label>
      {{ info.name }}
    </div>
    <div class="accordion-body">
      <ul v-if="info.sub.length !== 0" class="menu menu-nav">
        <li v-for="item in info.sub" :key="item.id" class="menu-item">
          <only-folder-item :info="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "only-folder-item",
  props: ["info"],
  data() {
    return {
      idHash: Math.random()
        .toString(36)
        .substring(2, 8)
    };
  },
  computed: {
    isActive() {
      return this.lgModal.data.select === this.info.path;
    },
    ...mapState("tools", ["lgModal"])
  },
  methods: {
    select() {
      this.$set(this.lgModal.data, "select", this.info.path);
    }
  }
};
</script>
