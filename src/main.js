// import Vue from "vue";
// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";

// Vue.use(ElementUI);

const Vue = require('vue')
const ElementUI = require('element-ui')
const axios = require('axios')

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
