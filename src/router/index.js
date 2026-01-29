import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: () => import("../views/detail.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
