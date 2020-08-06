<template>
  <div>
    <el-input
      v-model="value"
      placeholder="输入名称"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="handleFilter"
    />
    <slot></slot>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: undefined
    };
  },
  mounted: {
    handleFilter() {
      this.search();
    }
  }
};
</script>
