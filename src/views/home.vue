<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="商品" name="commodity">
      <commodity @error="error" />
    </el-tab-pane>
    <el-tab-pane label="品牌" name="brand">
      <brand />
    </el-tab-pane>
    <el-tab-pane label="供货商" name="supplier">
      <supplier />
    </el-tab-pane>
    <el-tab-pane label="分类" name="classify">
      <classify />
    </el-tab-pane>
    <el-tab-pane label="订单" name="order">
      <order />
    </el-tab-pane>
    <!-- <el-tab-pane label="11" name="commodity1">
      <base-table :table="tableName[0]" />
    </el-tab-pane>-->
  </el-tabs>
</template>

<script>
import TableView from "./TableView";
import Brand from "../component/table/Brand";
import Classify from "../component/table/Classify";
import Supplier from "../component/table/Supplier";
import Commodity from "../component/table/Commodity";
import BaseTable from "../component/table/BaseTable";
import Order from "../component/table/Order";

export default {
  components: {
    TableView,
    Brand,
    Classify,
    Supplier,
    Commodity,
    BaseTable,
    Order
  },
  data() {
    return {
      activeName: "order",
      tableName: [
        {
          name: "商品",
          index: "commodity",
          col: [
            { item: "code", name: "商品代码" },
            { item: "name", name: "商品名称" },
            { item: "size", name: "规格" },
            { item: "type", name: "型号" },
            { item: "measure", name: "计量单位" },
            { item: "marketPrice", name: "场价" },
            { item: "sellingPrice", name: "销售价" },
            { item: "costPrice", name: "成本价" },
            { item: "img", name: "商品缩略图" },
            { item: "about", name: "商品介绍" },
            { item: "num", name: "库存数量" },
            { item: "brandName", name: "商品品牌" },
            { item: "supplierName", name: "商品供货商" },
            { item: "classifyName", name: "商品分类" }
          ],
          temp: {
            id: "",
            code: "",
            name: "",
            size: "",
            type: "",
            measure: "",
            maketPrice: "",
            sellingPrice: "",
            costPrice: "",
            img: "",
            about: "",
            num: "",
            brandId: "",
            supplierId: "",
            classifyId: ""
          }
        },
        {
          name: "品牌",
          index: "brand",
          col: [
            { item: "name", name: "品牌名称" },
            { item: "url", name: "品牌网址" },
            { item: "icon", name: "品牌图片" }
          ]
        },
        {
          name: "供货商",
          index: "supplier",
          col: [
            { item: "name", name: "供货商名" },
            { item: "contact", name: "联系人" },
            { item: "contactPhone", name: "联系电话" },
            { item: "about", name: "供货商简介" }
          ]
        },
        {
          name: "分类",
          index: "classify",
          col: [
            { item: "name", name: "分类名称" },
            { item: "icon", name: "分类图片" },
            { item: "parent", name: "父分类" },
            { item: "level", name: "分类级别" }
          ]
        }
      ]
    };
  },
  mounted() {
    // this.error();
  },
  methods: {
    error() {
      this.$alert("获取数据失败，服务无法使用", "服务异常", {
        // confirmButtonText: "确定",
        showClose: false,
        showConfirmButton: false
        // callback: action => {
        //   this.$message({
        //     type: "info",
        //     message: `action: ${action}`
        //   });
        // }
      });
    },
    changePage(params) {
      console.log("dfasf");
      console.log(params);
      this.activeName = params.tableName;
      // this.$refs.brand.outSearch(params.value);
      console.log(this.$refs.brand.uid);
    },
    handleClick(tab, event) {
      //console.log(tab, event);
    }
  }
};
</script>