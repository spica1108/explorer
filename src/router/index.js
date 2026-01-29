import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Detail from "../views/detail.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: Detail,
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: () => import("../views/star.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
