<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th>文件名</th>
        <th>路径</th>
        <th>创建时间(本地)</th>
        <th>更新时间(本地))</th>
        <th>创建时间(云端)</th>
        <th>更新时间(云端)</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.path }}</td>
        <td>{{ item.created_at_l }}</td>
        <td>{{ item.updated_at_l }}</td>
        <td>{{ item.created_at_c }}</td>
        <td>{{ item.updated_at_c }}</td>
        <td>
          <div class="btn-group btn-group-block">
            <button
              class="btn"
              @click="checkLocalOperate({ operate: 'keepLocal', index: index })"
            >
              保留本地
            </button>
            <button
              class="btn"
              @click="checkLocalOperate({ operate: 'keepCloud', index: index })"
            >
              保留云端
            </button>
            <button
              class="btn"
              @click="checkLocalOperate({ operate: 'notOpe', index: index })"
            >
              不操作
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "check-local-status",
  computed: {
    ...mapState({
      data: state => state.tools.miModal.data
    })
  },
  methods: {
    ...mapActions("other", ["checkLocalOperate"])
  }
};
</script>
