import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const demoRoutes = require
  .context("../demo", true, /\.*index.vue$/)
  .keys()
  .map((key) => {
    const name = key.replace(/(\.\/|\/index\.vue)/g, "");
    return {
      path: `/demo/${name}`,
      name,
      component: () => import(`../demo/${name}/index.vue`),
    };
  });
const routes: Array<RouteRecordRaw> = [...demoRoutes];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
