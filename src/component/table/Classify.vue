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
          <el-form-item label="商品代码">
            <el-input v-model="temp.code" />
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="temp.size" />
          </el-form-item>
          <el-form-item label="型号">
            <el-input v-model="temp.type" />
          </el-form-item>
          <el-form-item label="计量单位">
            <el-input v-model="temp.measure" />
          </el-form-item>
          <el-form-item label="市场价">
            <el-input v-model="temp.maketPrice" />
          </el-form-item>
          <el-form-item label="销售价">
            <el-input v-model="temp.sellingPrice" />
          </el-form-item>
          <el-form-item label="成本价">
            <el-input v-model="temp.costPrice" />
          </el-form-item>
          <el-form-item label="商品缩略图">
            <el-input v-model="temp.img" />
          </el-form-item>
          <el-form-item label="商品介绍">
            <el-input v-model="temp.about" />
          </el-form-item>
          <el-form-item label="库存数量">
            <el-input v-model="temp.num" />
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
        classify_id: null,
        classify_name: null,
        classify_icon: null,
        classify_parent: null,
        classify_level: null
      },
      table: {
        name: "分类",
        index: "classify",
        col: [
          { item: "name", name: "分类名称" },
          { item: "icon", name: "分类图片" },
          { item: "parent", name: "父分类" },
          { item: "level", name: "分类级别" }
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
        classify_id: null,
        classify_name: null,
        classify_icon: null,
        classify_parent: null,
        classify_level: null
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