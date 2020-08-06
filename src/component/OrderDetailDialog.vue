<template>
  <el-dialog visible>
    <order-detail />
  </el-dialog>
</template>

<script>
import OrderDetail from "./table/OrderDetail";

export default {
  props: ["visible"],
  components: {
    OrderDetail
  },
  data() {}
};
</script>