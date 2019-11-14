<template>
  <div class="form-group">
    <div class="col-3 col-sm-12">
      <label class="form-label">{{ info[k].label }}</label>
    </div>
    <div class="col-9 col-sm-12 has-icon-right">
      <select
        v-if="info[k].type==='select'"
        class="form-select"
        v-model="config[k]"
        :required="info[k].required"
        :disabled="info[k].disabled"
        :readonly="info[k].readonly"
      >
        <option v-for="item in info[k].options" :key="item.id" :value="item.value">{{ item.label }}</option>
      </select>
      <template v-else-if="info[k].type==='radio'">
        <label v-for="item in info[k].options" :key="item.id" class="form-radio form-inline">
          <input type="radio" :name="key" :value="item.value" v-model="config[k]" />
          <i class="form-icon"></i>
          {{ item.label }}
        </label>
      </template>
      <label
        v-else-if="info[k].type==='switch'"
        class="form-switch"
        :disabled="info[k].disabled"
        :readonly="info[k].readonly"
      >
        <input type="checkbox" v-model="config[k]" />
        <i class="form-icon"></i> 开启/关闭
      </label>
      <input
        v-else
        :class="'form-input' + (status === 'error' ? ' is-error' : '')"
        :type="info[k].type"
        v-model="config[k]"
        :placeholder="info[k].placeholder"
        :required="info[k].required"
        :disabled="info[k].disabled"
        :readonly="info[k].readonly"
      />
      <i :class="'form-icon icon' + (status === 'loading' ? ' loading' : '')"></i>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "form-group",
  props: ["config", "info", "k", "status"]
};
</script>
