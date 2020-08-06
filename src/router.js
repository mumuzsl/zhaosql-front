// import Vue from "vue";
// import Router from "vue-router";
// Vue.use(Router);

const Router = require('vue-router')

const constantRoutes = [
  {
    path: "/",
    component: (resolve) => require(['~/views/home'], resolve),
    name: "",
    hidden: true
  },
  {
    path: "/error",
    component: (resolve) => require(['~/views/ErrorPage'], resolve),
    hidden: true
  }
];

const createRouter = () =>
  new Router({
    routes: constantRoutes
  });

const router = createRouter();

export default router;
