<template>
  <div v-loading="loading">
    <div class="top">
      <slot name="search-bar" class="item"></slot>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
      <slot name="form"></slot>
      <el-button @click="dialogFormVisible=false">取消</el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectData,
  insertData,
  updateData,
  deleteData,
  searchData
} from "~/api/api";

export default {
  props: ["table", "temp", "query"],
  components: {},
  data() {
    return {
      searchStatus: false,
      result: {
        content: [{ code: "1000", num: 10 }, { code: "1001", num: 10 }]
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
        page: 1
      }
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.selectData();
    });
  },
  computed: {
    currentPage: {
      get() {
        return this.selectParams.page;
      },
      set(val) {
        this.selectParams.page = val;
      }
    },
    queryParam: function() {
      return Object.assign({ page: this.currentPage - 1 }, this.query);
    }
  },
  methods: {
    handleRefresh() {
      this.selectData();
    },
    handleSearch() {
      this.searchStatus = true;
      let o = this.queryParam;
      // console.log("search");
      // console.log(o);
      this.loading = true;
      searchData(this.table.index, o)
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
      if (!this.searchStatus) {
        this.selectData();
      } else {
        this.handleSearch();
      }
      scrollTo(0, 800);
    },
    selectData() {
      this.loading = true;
      let t = this.table.index;
      let o = Object.assign({}, this.selectParams);
      // console.log(o);
      selectData(t, o)
        .then(response => {
          console.log(response.data);
          this.result = response.data;

          setTimeout(() => {
            this.loading = false;
          }, 0.5 * 1000);
        })
        .catch(error => {
          // this.errorMessage("获取 " + this.table.name + " 数据失败");
          // this.$router.replace("error");
          this.$emit("error");
        });
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
      this.$emit("update", row);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.dialogFormVisible = false;
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
    },
    resetTemp() {
      this.$emit("reset-temp");
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
</style>