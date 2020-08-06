<template>
  <div>
    <el-table
      :data="content"
      style="width: 100%"
      fit
      highlight-current-row
      @selection-change="selsChange"
    >
      <!-- <el-table-column type="selection" align="center"></el-table-column> -->
      <template v-for="(col) in table.col">
        <el-table-column :prop="col.item" :label="col.name" :key="col.item"></el-table-column>
      </template>
      <!-- <el-table-column label="操作" align="center" size="mini">
        <template slot-scope="{row}">
          <el-button type="primary" @click="handleUpdate(row)">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- <el-dialog :visible="dialogVisible">
      <el-form :ref="dataForm">
        <el-form-item prop="orderId"></el-form-item>
      </el-form>
    </el-dialog> -->
  </div>
</template>

<script>
import ShowTable from "./ShowTable";

export default {
  props: ["content"],
  components: {
    ShowTable
  },
  data() {
    return {
      dialogVisible: false,
      temp: {
        orderId: null,
        code: null,
        price: null,
        num: null,
        sum: null
      },
      table: {
        name: "订单详情",
        index: "orderDetail",
        col: [
          { item: "orderId", name: "订单编号" },
          { item: "code", name: "商品代码" },
          { item: "price", name: "单价" },
          { item: "num", name: "数量" },
          { item: "sum", name: "总金额" }
        ]
      }
    };
  },
  methods: {
    selsChange(val) {},
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
    }
  }
};
</script>