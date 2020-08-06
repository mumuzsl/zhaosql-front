<template>
  <el-table
    :data="content"
    style="width: 100%"
    fit
    highlight-current-row
    @selection-change="selsChange"
  >
    <el-table-column type="selection" align="center"></el-table-column>
    <template v-for="(col) in table.col">
      <el-table-column :prop="col.item" :label="col.name" :key="col.item"></el-table-column>
    </template>
    <el-table-column label="操作" align="center" size="mini">
      <template slot-scope="{row}">
        <el-button type="primary" @click="handleUpdate(row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ["table", "content"],
  data() {
    return {};
  },
  methods: {
    selsChange(val) {
      this.$emit("sels-change", val);
    },
    handleUpdate(row) {
      this.$emit("handleUpdate", row);
    }
  }
};
</script>