<template>
  <el-dialog
    :visible="dialogVisible"
    :before-close="handleClose"
    width="450px"
    @opened="handleOpened"
  >
    <!-- <el-button type="primary" @click="handleSelect">选择商品</el-button> -->
    <el-progress v-if="false" type="circle" :percentage="percentage"></el-progress>
    <div v-if="true">
      <el-collapse v-model="activeNames" :accordion="true">
        <el-collapse-item title="商品列表" name="1">
          <el-row>
            <el-col :span="12">商品名</el-col>
            <el-col :span="8">数量</el-col>
            <el-col :span="4">库存</el-col>
          </el-row>
          <template v-for="(c, index) in coms">
            <el-row :key="c.commodity.id">
              <el-col :span="12">
                <el-input v-model="c.commodity.name" :disabled="true" />
              </el-col>
              <el-col :span="8">
                <el-input-number
                  v-model="c.num"
                  :min="0"
                  :max="c.commodity.num"
                  :disabled="c.commodity.num<=0"
                  @change="numChange(c.num, index)"
                  style="width:120px"
                ></el-input-number>
              </el-col>
              <el-col :span="4">
                <el-input :value="c.commodity.num <= 0 ? '无货':c.commodity.num" :disabled="true" />
                <!-- <span>{{c.num <= 0 ? '无货':c.num}}</span> -->
              </el-col>
            </el-row>
          </template>
        </el-collapse-item>
        <el-collapse-item title="客户信息" name="2">
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
        </el-collapse-item>
      </el-collapse>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="createOrder">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { insertOrder } from "~/api/api";

export default {
  props: ["dialogVisible", "cs"],
  data() {
    return {
      comsa: [],
      comsb: [],
      nums: [],
      activeNames: ["1"],
      temp: {
        id: null,
        name: null,
        phone: null,
        address: null,
        postcode: null,
        createTime: new Date(),
        totalPrice: null
      },
      percentage: 0,
      statusNum: -1,
      statusText: ["success", "exception", "warning"]
    };
  },
  watch: {
    cs: function(n, o) {
      console.log("n");
      console.log(n);
    }
  },
  computed: {
    coms: {
      get() {
        return this.comsa.concat(this.comsb);
      },
      set(val) {
        this.comsa = [];
        this.comsb = [];
      }
    }
  },
  methods: {
    handleClose() {
      this.coms = [];
      this.$emit("close");
      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     this.$emit("close");
      //   })
      //   .catch(_ => {});
    },
    close() {
      this.$emit("close");
    },
    createOrder(v) {
      console.log(this.comsa);
      console.log(this.temp);
      let o = Object.assign({}, { ods: this.comsa }, { order: this.temp });
      insertOrder(o)
        .then(response => {
          console.log(response);
          this.$message({ message: "order insert succeed", type: "success" });
          this.close();
        })
        .catch(error => {
          console.log("create order faild");
          console.log(error);
        });
    },
    handleSelect() {
      this.$emit("select");
    },
    numChange(v, a) {
      // console.log(v);
      // console.log(a);
      if (v === 0) {
        this.coms.splice(a, 1);
      }
    },
    handleChange() {},
    handleOpened() {
      let len = this.cs.length;
      if (len == 0) return;
      let step = 100 / this.cs.length;
      this.cs.forEach(element => {
        let o = Object.assign({}, element);
        // o.cnum = 1;
        // this.percentage += parseInt(step);
        if (element.num === null || element.num <= 0) {
          o.num = 0;
          this.comsb.push({ num: 1, commodity: o });
        } else {
          this.comsa.push({ num: 1, commodity: o });
        }
      });
      this.percentage = 100;

      console.log(this.coms);

      setTimeout(() => {
        this.statusNum = 0;
      }, 1 * 1000);
    },
    handlePercent(step) {
      let p = this.percentage;
      if (this.percentage >= 100) this.statusNum = 0;
      this.percentage = p + parseInt(step);
      console.log(this.percentage);
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
    }
  }
};
</script>

<style>
.a {
}
</style>