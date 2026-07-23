import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import * as Auth from "@/utils/auth.js";

const routes = [
  // ログイン用フォーム
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
  // ログイン後の画面で使用するフォーム
  // メニューなどの全画面共通コンポーネントを設定
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
        name: "userMaster",
        component: () => import("@/views/users/UserMaster.vue"),
      },
      {
        path: "master/users/create",
        name: "userCreate",
        component: () => import("@/views/users/UserForm.vue"),
      },
      {
        path: "master/users/:id/edit",
        name: "userEdit",
        component: () => import("@/views/users/UserForm.vue"),
      },
      {
        path: "master/products",
        name: "productMaster",
        component: () => import("@/views/products/ProductMaster.vue"),
      }
    ],
  },
];

const router = createRouter({
  // envファイルのBASE_URLをimport
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/**
 * ナビゲーションガード
 */
router.beforeEach((to) => {
  // ログインされていない場合にログイン画面二遷移する
  if (to.name !== "login" && !Auth.isLogin()) {
    return "/login";
  }
});

export default router;
