<template>
  <div v-loading="loading">
    <div class="top">
      <el-button @click="orderStat" type="primary" :disabled="statBtn">订单统计</el-button>
      <el-input
        v-model="value"
        placeholder="输入关键字"
        style="width: 200px;"
        class="filter-item"
        :clearable="true"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <!-- <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button> -->
      <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <el-table
      :data="result.content"
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
          <el-button type="primary" @click="showDetail(row)">订单详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <el-col :span="2">
        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      </el-col>
      <el-col :span="20">
        <el-pagination
          v-show="result.totalPages>0"
          background
          :page-size="result.size"
          layout="total, prev, pager, next, jumper"
          :total="result.totalElements"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      width="500px"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 310px; margin-left:50px;"
      >
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="客户手机号" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="客户地址" prop="address">
          <el-input v-model="temp.address"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="postcode">
          <el-input v-model="temp.postcode"></el-input>
        </el-form-item>
        <el-form-item label="订购时间" prop="createTime">
          <el-date-picker v-model="temp.createTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="订购总金额" prop="totalPrice">
          <el-input v-model="temp.totalPrice"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="dialogFormVisible=false">取消</el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
    </el-dialog>

    <el-dialog :visible.sync="dialogShow">
      <order-detail :content="detailData" />
    </el-dialog>

    <el-dialog :visible.sync="statDialogVisible" title="订单统计">
      <div class="stat">
        <div class="stat-item">
          <div class="stat-tip">
            <span>最大金额</span>
          </div>
          <div class="stat-body">
            <strong>{{stat.total_price_max.toFixed(2)}}</strong>
            <span>元</span>
          </div>
        </div>
        <!-- <div>
          <el-divider direction="vertical"></el-divider>
        </div>-->
        <div class="stat-item">
          <div class="stat-tip">
            <span>最小金额</span>
          </div>
          <div class="stat-body">
            <strong>{{stat.total_price_min.toFixed(2)}}</strong>
            <span>元</span>
          </div>
        </div>
        <!-- <el-divider direction="vertical"></el-divider> -->
        <div class="stat-item">
          <div class="stat-tip">
            <span>平均金额</span>
          </div>
          <div class="stat-body">
            <strong>{{stat.total_price_avg.toFixed(2)}}</strong>
            <span>元</span>
          </div>
        </div>
        <!-- <el-divider direction="vertical"></el-divider> -->
        <div class="stat-item">
          <div class="stat-tip">
            <span>订单总数</span>
          </div>
          <div class="stat-body">
            <strong>{{stat.count.toFixed(0)}}</strong>
            <span>条</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectData,
  insertData,
  updateData,
  deleteData,
  searchData,
  selectOrder,
  getDetail,
  getStat
} from "~/api/api";
import OrderDetailDialog from "../OrderDetailDialog";
import OrderDetail from "./OrderDetail";
import TweenLite from "TweenLite";

export default {
  components: {
    OrderDetailDialog,
    OrderDetail
  },
  data() {
    return {
      statBtn: false,
      stat: {
        total_price_min: 0,
        total_price_avg: 0,
        total_price_max: 0,
        count: 0
      },
      statDialogVisible: false,
      value: "",
      detailData: [],
      dialogShow: false,
      result: {
        content: [
          { code: "1000", num: 10 },
          { code: "1001", num: 10 }
        ]
      },
      loading: false,
      dialogFormVisible: false,
      sels: [],
      textMap: {
        update: "编辑",
        create: "添加"
      },
      dialogStatus: "",
      selectParams: {
        page: 0,
        order: null
      },
      temp: {
        id: null,
        name: null,
        phone: null,
        address: null,
        postcode: null,
        createTime: null,
        totalPrice: null
      },
      table: {
        name: "商品",
        index: "order",
        col: [
          //   { item: "id", name: "订单编号" },
          { item: "name", name: "客户姓名" },
          { item: "phone", name: "客户手机号" },
          { item: "address", name: "客户地址" },
          { item: "postcode", name: "邮编" },
          { item: "createTime", name: "订购时间" },
          { item: "totalPrice", name: "订购总金额" }
        ]
      }
    };
  },
  watch: {},
  mounted() {
    this.$nextTick(function() {
      this.selectData();
    });
  },
  computed: {
    currentPage: {
      get() {
        return this.selectParams.page + 1;
      },
      set(val) {
        this.selectParams.page = val - 1;
      }
    }
  },
  methods: {
    getStat() {
      getStat()
        .then(response => {
          this.$message({
            message: "get stat succeed",
            type: "success"
          });
          console.log(response);
          let data = response.data;
          setTimeout(() => {
            Object.keys(data).forEach(key => {
              let o = {};
              o[key] = data[key];
              console.log(o);
              TweenLite.to(this.$data.stat, 0.5, o);
            });
          }, 500);
        })
        .catch(error => {
          this.$message.error("get stat failed");
        });
    },
    orderStat() {
      Object.keys(this.$data.stat).forEach(k => {
        this.$data.stat[k] = 0;
      });
      this.getStat();
      this.statDialogVisible = true;
    },
    showDetail(row) {
      let id = "orderId=" + row.id;
      console.log(id);
      getDetail(id)
        .then(response => {
          console.log(response);
          this.detailData = response.data;
          this.statBtn = true;
        })
        .catch(error => {
          this.errorMessage("order detail faild");
        });
      this.dialogShow = true;
    },
    resetTemp() {
      this.temp = {
        id: null,
        name: null,
        phone: null,
        address: null,
        postcode: null,
        createTime: new Date(),
        totalPrice: null
      };
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
    },
    clearValidate() {
      this.$refs["dataForm"].clearValidate();
    },
    handleRefresh() {
      this.value = "";
      this.selectParams.order = null;
      this.selectData();
    },
    handleSearch() {
      this.selectParams.order = { name: this.value };
      selectOrder(this.selectParams)
        .then(response => {
          console.log(response.data);
          this.result = response.data;

          setTimeout(() => {
            this.loading = false;
          }, 0.01 * 1000);
        })
        .catch(error => {});
    },
    handleCurrentChange(val) {
      console.log(this.selectParams);
      this.selectData();
      scrollTo(0, 800);
    },
    selectData() {
      this.loading = true;
      let t = this.table.index;
      let o = Object.assign({}, this.selectParams);
      // console.log(o);
      selectOrder(this.selectParams)
        .then(response => {
          console.log(response.data);
          this.result = response.data;

          setTimeout(() => {
            this.loading = false;
          }, 0.5 * 1000);
        })
        .catch(error => {});
    },
    batchRemove: function() {
      var ids = this.sels.map(item => item.id);
      console.log(ids);
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteData(this.table.index, ids).then(res => {
            // this.$message({
            //   message: "删除成功",
            //   type: "success"
            // });
            this.message("删除成功");
            this.selectData();
          });
        })
        .catch(() => {});
    },
    message(msg) {
      this.$message({
        message: msg,
        type: "success"
      });
    },
    errorMessage(msg) {
      this.$message.error(msg);
    },
    selsChange: function(sels) {
      console.log(sels);
      this.sels = sels;
      this.$emit("sels-change", sels);
    },
    createData() {
      console.log("create");
      let index = this.table.index;
      insertData(index, this.temp)
        .then(() => {
          this.dialogFormVisible = false;
          // this.$notify({
          //   title: "Success",
          //   message: "添加数据成功！",
          //   type: "success",
          //   duration: 2000
          // });
          this.message("添加数据成功！");
          this.selectData();
          this.resetTemp();
        })
        .catch(() => {
          this.errorMessage("添加数据失败！");
        });
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$emit("clear-validate");
      });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$emit("clear-validate");
      });
      this.temp = Object.assign({}, row);
      // this.$emit("update", row);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.dialogFormVisible = false;
          this.dialogShow = false;
        })
        .catch(_ => {});
    },
    updateData() {
      console.log("uuuuuuuu");
      updateData(this.table.index, this.temp).then(() => {
        this.dialogFormVisible = false;
        // this.$notify({
        //   title: "Success",
        //   message: "数据更新成功！",
        //   type: "success",
        //   duration: 2000
        // });
        this.message("数据更新成功！");
        this.selectData();
        this.resetTemp();
      });
    }
  }
};
</script>

<style>
.top {
  margin-top: 10px;
}

.item {
  margin-right: 110px;
}

.stat {
  /* font-size: 20px; */
  display: inline;
}

.stat-item {
  /* display: block; */
  /* width: 50px; */
  /* height: 100px; */
  display: inline-block;
  /* margin-right: 25px;
  margin-left: 25px; */
  width: 200px;
}

.stat-tip {
  /* vertical-align: top; */
  /* display: inline; */
  vertical-align: left;
  color: #ff6666;
}

.stat-body > strong {
  font-weight: bold;
  font-size: 44px;
  line-height: 68px;
}

.stat > strong {
  font-weight: bold;
  font-size: 44px;
  line-height: 68px;
  /* vertical-align: top; */
}
</style>