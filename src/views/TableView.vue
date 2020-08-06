<template>
  <div v-loading="loading">
    <div class="filter-container">
      <el-row>
        <el-input
          v-model="listQuery.value"
          placeholder="输入名称"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-radio v-model="radio" label="商品代码" :disabled="!(table.index=='commodity')" />
        <el-radio v-model="radio" label="名称" />
        <el-radio v-model="radio" label="内部id" :disabled="true" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      </el-row>

      <el-table
        :key="tableKey"
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
        <!-- 商品表 -->
        <el-form
          v-if="table.index==='commodity'"
          ref="dataForm"
          :model="temp.commodity"
          label-position="left"
          label-width="100px"
          style="width: 300px; margin-left:50px;"
        >
          <el-form-item label="商品代码">
            <el-input v-model="temp.commodity.code" />
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="temp.commodity.name" />
          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="temp.commodity.size" />
          </el-form-item>
          <el-form-item label="型号">
            <el-input v-model="temp.commodity.type" />
          </el-form-item>
          <el-form-item label="计量单位">
            <el-input v-model="temp.commodity.measure" />
          </el-form-item>
          <el-form-item label="市场价">
            <el-input v-model="temp.commodity.maketPrice" />
          </el-form-item>
          <el-form-item label="销售价">
            <el-input v-model="temp.commodity.sellingPrice" />
          </el-form-item>
          <el-form-item label="成本价">
            <el-input v-model="temp.commodity.costPrice" />
          </el-form-item>
          <el-form-item label="商品缩略图">
            <el-input v-model="temp.commodity.img" />
          </el-form-item>
          <el-form-item label="商品介绍">
            <el-input v-model="temp.commodity.about" />
          </el-form-item>
          <el-form-item label="库存数量">
            <el-input v-model="temp.commodity.num" />
          </el-form-item>
        </el-form>
        <!-- 品牌表 -->
        <el-form
          v-if="table.index==='brand'"
          ref="dataForm"
          :model="temp.brand"
          label-position="left"
          label-width="100px"
          style="width: 300px; margin-left:50px;"
        >
          <el-form-item label="品牌名称">
            <el-input v-model="temp.brand.brand_name" />
          </el-form-item>
          <el-form-item label="品牌网址">
            <el-input v-model="temp.brand.brand_url" />
          </el-form-item>
          <el-form-item label="品牌图片">
            <el-input v-model="temp.brand.brand_icon" />
          </el-form-item>
        </el-form>
        <!-- 供货商表 -->
        <el-form
          v-if="table.index==='supplier'"
          ref="dataForm"
          :model="temp.supplier"
          label-position="left"
          label-width="100px"
          style="width: 300px; margin-left:50px;"
        >
          <el-form-item label="供货商名">
            <el-input v-model="temp.supplier.supplier_name" />
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="temp.supplier.supplier_contact" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="temp.supplier.supplier_contact_phone" />
          </el-form-item>
          <el-form-item label="供货商简介">
            <el-input v-model="temp.supplier.supplier_about" />
          </el-form-item>
        </el-form>
        <!-- 分类表 -->
        <el-form
          v-if="table.index==='classify'"
          ref="dataForm"
          :model="temp.classify"
          label-position="left"
          label-width="100px"
          style="width: 300px; margin-left:50px;"
        >
          <el-form-item label="分类名称">
            <el-input v-model="temp.classify.classify_name" />
          </el-form-item>
          <el-form-item label="分类图片">
            <el-input v-model="temp.classify.classify_icon" />
          </el-form-item>
        </el-form>
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { selectData, insertData, updateData, deleteData } from "../api/api";
import { scrollTo } from "../utils/scroll-to";

export default {
  props: ["table", "searchValue"],
  components: {
  },
  data() {
    return {
      radio: "内部id",
      selectParams: {
        page: 1
      },
      listQuery: {
        tableName: undefined,
        value: undefined
      },
      listLoading: true,
      sels: [], //列表选中列
      tableKey: 0,
      tableData: [],
      content: [],
      result: {
        content: [{ code: "1000", num: 10 }, { code: "1001", num: 10 }]
      },
      loading: false,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      temp: {
        commodity: {
          id: null,
          code: null,
          name: null,
          size: null,
          type: null,
          measure: null,
          maketPrice: null,
          sellingPrice: null,
          costPrice: null,
          img: null,
          about: null,
          num: null,
          brandId: null,
          supplierId: null,
          classifyId: null
        },
        brand: {
          brand_id: null,
          brand_name: null,
          brand_url: null,
          brand_icon: null
        },
        supplier: {
          supplier_id: null,
          supplier_name: null,
          supplier_contact: null,
          supplier_contact_phone: null,
          supplier_about: null
        },
        classify: {
          classify_id: null,
          classify_name: null,
          classify_icon: null,
          classify_parent: null,
          classify_level: null
        }
      }
    };
  },
  computed: {
    currentPage: {
      get() {
        return this.selectParams.page;
      },
      set(val) {
        this.selectParams.page = val;
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.selectData();
    });
  },
  methods: {
    outSearch(v) {
      this.listQuery.value = v;
      //this.search();
    },
    search() {
      let o1 = Object.assign(this.listQuery, {
        tableName: "brand"
      });
      this.$emit("change-page", o1);
    },
    selectData() {
      let t = this.table.index;
      let o = Object.assign({}, this.selectParams);
      // console.log(o);
      selectData(t, o)
        .then(response => {
          console.log(response.data);
          this.result = response.data;

          setTimeout(() => {
            this.loading = false;
          }, 1.5 * 1000);
        })
        .catch(error => {
          this.messageError(error);
        });
    },
    messageError: function(error) {
      if (this.loading) {
        this.loading = false;
      }
      if (error.response == undefined) {
        //this.messageError("查询" + this.table.name + "数据失败，网络错误");
        return;
      }
      let m = error.response.data.message;
      this.messageError(m);
    },
    handleCurrentChange(val) {
      this.selectData();
      scrollTo(0, 800);
    },
    handleFilter() {
      //this.listQuery.page = 1;
      //this.getList();
      this.search();
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.dialogFormVisible = false;
        })
        .catch(_ => {});
    },
    handleUpdate(row) {
      this.temp[this.table.index] = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    resetTemp() {
      this.temp = {
        commodity: {
          id: null,
          code: null,
          name: null,
          size: null,
          type: null,
          measure: null,
          maketPrice: null,
          sellingPrice: null,
          costPrice: null,
          img: null,
          about: null,
          num: null,
          brandId: null,
          supplierId: null,
          classifyId: null
        },
        brand: {
          brand_id: null,
          brand_name: null,
          brand_url: null,
          brand_icon: null
        },
        supplier: {
          supplier_id: null,
          supplier_name: null,
          supplier_contact: null,
          supplier_contact_phone: null,
          supplier_about: null
        },
        classify: {
          classify_id: null,
          classify_name: null,
          classify_icon: null,
          classify_parent: null,
          classify_level: null
        }
      };
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteData(this.table.index, ids).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    createData() {
      console.log("aaaaaaaaa");
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let index = this.table.index;
          insertData(index, this.temp[index])
            .then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Created Successfully",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              this.messageError(error);
            });
        }
      });
    },
    updateData() {
      console.log("uuuuuuuu");
      // this.$refs["dataForm"].validate(valid => {
      //   if (valid) {
      //     const tempData = Object.assign({}, this.temp);
      //     tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      //     updateData(tempData).then(() => {
      //       for (const v of this.list) {
      //         if (v.id === this.temp.id) {
      //           const index = this.list.indexOf(v);
      //           this.list.splice(index, 1, this.temp);
      //           break;
      //         }
      //       }
      //       this.dialogFormVisible = false;
      //       this.$notify({
      //         title: "Success",
      //         message: "Update Successfully",
      //         type: "success",
      //         duration: 2000
      //       });
      //     });
      //   }
      // });
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