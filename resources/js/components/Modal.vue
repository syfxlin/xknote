<template>
  <div
    :class="
      'modal ' +
        (size === 'sm' ? 'modal-sm' : '') +
        (size === 'lg' ? 'modal-lg' : '') +
        ' xknote-' +
        size +
        '-modal' +
        (data.operate ? ' active' : '')
    "
  >
    <a class="modal-overlay"></a>
    <div :class="'modal-container ' + data.operate">
      <div class="modal-header">
        <div class="modal-title h5">{{ data.title }}</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <slot></slot>
        </div>
      </div>
      <div class="modal-footer">
        <button
          v-if="data.confirm"
          class="btn btn-primary"
          @click="data.confirm.handler()"
        >
          {{ data.confirm.content || "确认" }}
        </button>
        <button
          v-if="data.cancel"
          class="btn btn-link"
          @click="data.cancel.handler()"
        >
          {{ data.cancel.content || "取消" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "modal",
  props: ["data", "size"]
};
</script>
