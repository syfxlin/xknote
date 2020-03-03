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
        <button class="btn btn-primary" @click="data.confirm()">确认</button>
        <button class="btn btn-link" @click="data.cancel()">取消</button>
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
