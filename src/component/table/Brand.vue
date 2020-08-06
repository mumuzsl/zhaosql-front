<template>
  <div>
    <base-table
      :table="table"
      :temp="temp"
      :query="query"
      v-on:update="handleUpdate"
      v-on:reset-temp="resetTemp"
      v-on:clear-validate="clearValidate"
    >
      <template #search-bar>
        <el-input
          v-model="query.value.name"
          placeholder="输入关键字"
          style="width: 200px;"
          class="filter-item"
          :clearable="true"
        />
      </template>
      <template #form>
        <!-- 商品表 -->
        <el-form
          ref="dataForm"
          :model="temp"
          label-position="left"
          label-width="100px"
          style="width: 300px; margin-left:50px;"
        >
          <el-form-item label="品牌名称">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item label="品牌网址">
            <el-input v-model="temp.url" />
          </el-form-item>
          <el-form-item label="品牌图片">
            <el-input v-model="temp.icon" />
          </el-form-item>
        </el-form>
      </template>
    </base-table>
  </div>
</template>

<script>
import { selectData, insertData, updateData, deleteData } from "~/api/api";
import { scrollTo } from "~/utils/scroll-to";
import BaseTable from "./BaseTable";

export default {
  components: {
    BaseTable
  },
  data() {
    return {
      query: { value: { name: "" } },
      radio: "内部id",
      selectParams: {
        page: 1
      },
      listQuery: {
        tableName: undefined,
        value: undefined
      },
      temp: {
        id: null,
        name: null,
        url: null,
        icon: null
      },
      table: {
        name: "品牌",
        index: "brand",
        col: [
          { item: "name", name: "品牌名称" },
          { item: "url", name: "品牌网址" },
          { item: "icon", name: "品牌图片" }
        ]
      }
    };
  },
  mounted() {
    this.$nextTick(function() {
      // this.selectData();
    });
  },
  methods: {
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
    },
    clearValidate() {
      this.$refs["dataForm"].clearValidate();
    },
    resetTemp() {
      this.temp = {
        id: null,
        name: null,
        url: null,
        icon: null
      };
    }
  }
};
</script>

<style>
.el-row {
  margin-top: 20px;
}
.el-col {
  border-radius: 4px;
  /* border: 2px solid red; */
}
</style>