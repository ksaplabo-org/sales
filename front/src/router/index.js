import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

const routes = [
  {
    path: "/login",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "login",
        component: () => import("@/views/Login.vue"),
      },
    ],
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "top",
        component: () => import("@/views/Top.vue"),
      },
      {
        path: "master/users",
        name: "user-list",
        component: () => import("@/views/users/UserMaster.vue"),
      },
    ],
  },
];

const router = createRouter({
  // envファイルのBASE_URLをimport
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
