<template>
  <div v-loading="false">
    <base-table
      :table="table"
      :temp="temp"
      :query="query"
      @error="error"
      v-on:reset-temp="resetTemp"
      v-on:update="handleUpdate"
      v-on:clear-validate="clearValidate"
      @sels-change="selsChange"
    >
      <template #search-bar>
        <el-badge :value="cs.length">
          <el-button
            type="primary"
            icon="el-icon-shopping-cart-2"
            @click="handleOrder"
            class="maring-right:40px;"
          >{{tip}}</el-button>
        </el-badge>
        <el-input
          v-model="value"
          :placeholder="'输入'+radio"
          style="width: 200px;"
          class="filter-item"
          :clearable="true"
        />
        <el-radio v-model="radio" label="商品名称" />
        <el-radio v-model="radio" label="商品代码" />
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

    <order-dialog
      :cs.sync="cs"
      :dialog-visible.sync="orderDialogVisible"
      v-on:close="handleClose"
      v-on:select="handleSelect"
    />
  </div>
</template>

<script>
import {
  selectData,
  insertData,
  updateData,
  deleteData,
  insertOrder
} from "~/api/api";
import { scrollTo } from "~/utils/scroll-to";
import BaseTable from "./BaseTable";
import OrderDialog from "~/component/OrderDialog";

export default {
  components: {
    BaseTable,
    OrderDialog
  },
  data() {
    return {
      cs: [
        // {
        //   id: 1,
        //   code: "10001",
        //   name: "商品1",
        //   size: null,
        //   type: null,
        //   measure: null,
        //   maketPrice: null,
        //   sellingPrice: null,
        //   costPrice: null,
        //   img: null,
        //   about: null,
        //   num: null,
        //   brandId: null,
        //   supplierId: null,
        //   classifyId: null
        //   // cnum: 0
        // },
        // {
        //   id: 2,
        //   code: "10002",
        //   name: "商品1",
        //   size: null,
        //   type: null,
        //   measure: null,
        //   maketPrice: null,
        //   sellingPrice: null,
        //   costPrice: null,
        //   img: null,
        //   about: null,
        //   num: 2,
        //   brandId: null,
        //   supplierId: null,
        //   classifyId: null
        //   // cnum: 0
        // },
        // {
        //   id: 3,
        //   code: "10002",
        //   name: "商品1",
        //   size: null,
        //   type: null,
        //   measure: null,
        //   maketPrice: null,
        //   sellingPrice: null,
        //   costPrice: null,
        //   img: null,
        //   about: null,
        //   num: 2,
        //   brandId: null,
        //   supplierId: null,
        //   classifyId: null
        //   // cnum: 0
        // }
      ],
      orderStatus: false,
      orderDialogVisible: false,
      radio: "商品名称",
      selectParams: {
        page: 1
      },
      value: "",
      temp: {
        id: null,
        code: null,
        name: "null",
        size: null,
        type: null,
        measure: null,
        marketPrice: null,
        sellingPrice: null,
        costPrice: null,
        img: null,
        about: null,
        num: null,
        brandId: null,
        supplierId: null,
        classifyId: null
      },
      table: {
        name: "商品",
        index: "commodity",
        col: [
          { item: "code", name: "商品代码" },
          { item: "name", name: "商品名称" },
          { item: "size", name: "规格" },
          { item: "type", name: "型号" },
          { item: "measure", name: "计量单位" },
          { item: "marketPrice", name: "市场价" },
          { item: "sellingPrice", name: "销售价" },
          { item: "costPrice", name: "成本价" },
          { item: "img", name: "商品缩略图" },
          { item: "about", name: "商品介绍" },
          { item: "num", name: "库存数量" },
          { item: "brandName", name: "商品品牌" },
          { item: "supplierName", name: "商品供货商" },
          { item: "classifyName", name: "商品分类" }
        ]
      },
      tip: "下订单"
    };
  },
  computed: {
    query: function() {
      return this.radio === "商品名称"
        ? { value: { name: this.value } }
        : { value: { code: this.value } };
    }
    // tip: function() {
    //   return this.orderStatus ? "回到订单" :;
    // }
  },
  mounted() {
    this.$nextTick(function() {
      // this.selectData();
    });
  },

  methods: {
    error() {
      this.$emit("error");
    },
    hello() {
      // console.log("hello");
      // console.log("sels");
      // this.cs = val;
    },
    selsChange(val) {
      console.log("sels");
      this.cs = val;
    },
    handleClose() {
      // this.cs = [];
      this.orderDialogVisible = false;
      this.orderStatus = false;
    },
    handleOrder() {
      // console.log(this.cs);
      // console.log(this.cs.length === 0);
      if (this.cs.length === 0) {
        this.$message.error("请选择商品");
        return;
      }
      this.tip;
      this.orderDialogVisible = true;
      this.orderStatus = true;
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
    },
    clearValidate() {
      this.$refs["dataForm"].clearValidate();
    },
    resetTemp() {
      this.temp = {
        id: null,
        code: null,
        name: null,
        size: null,
        type: null,
        measure: null,
        marketPrice: null,
        sellingPrice: null,
        costPrice: null,
        img: null,
        about: null,
        num: null,
        brandId: null,
        supplierId: null,
        classifyId: null
      };
    },
    handleSelect() {
      this.orderDialogVisible = false;
      this.orderStatus = true;
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
.item {
  position: fixed;
  margin-top: 200px;
}
</style>