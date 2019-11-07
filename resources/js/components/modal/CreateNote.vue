<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">文档名</label>
      </div>
      <div class="col-9 col-sm-12 has-icon-right">
        <input
          :class="'form-input' + (data.status === 'error' ? ' is-error' : '')"
          type="text"
          v-model="data.filename"
          required
        />
        <i :class="'form-icon icon' + (data.status === 'loading' ? ' loading' : '')"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">标题</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.title" required />
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">云端/本地</label>
      </div>
      <div class="col-9 col-sm-12">
        <select class="form-select" v-model="data.storage" required>
          <option value="cloud">云端</option>
          <option value="local">本地</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <div class="col-3 col-sm-12">
        <label class="form-label">存放的文件夹</label>
      </div>
      <div class="col-9 col-sm-12">
        <input class="form-input" type="text" v-model="data.select" required />
        <div v-if="!data.folders">
          <div class="loading"></div>
          <div class="text-gray text-center">正在加载，客官莫急。</div>
        </div>
        <template v-else>
          <hr />
          <only-folder-item v-for="item in data.folders" :key="item.id" :info="item" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import OnlyFolderItem from "../OnlyFolderItem";
export default {
  name: "create-note",
  components: {
    "only-folder-item": OnlyFolderItem
  },
  computed: {
    ...mapState({
      data: state => state.tools.lgModal.data
    })
  }
};
</script>
