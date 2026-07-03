import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import * as Auth from "@/utils/auth.js";

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
      {
        path: "master/users/form",
        name: "user-form",
        component: () => import("@/views/users/UserForm.vue"),
      },
    ],
  },
];

const router = createRouter({
  // envファイルのBASE_URLをimport
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// ナビゲーションガード
router.beforeEach((to) => {
  // ログインされていない場合にログイン画面二遷移する
  if (to.name !== "login" && !(Auth.isLogin())) {
    return "/login";
  }
});

export default router;
