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
        meta: {
          requiresAdmin: true,
        },
      },
      {
        path: "master/users/create",
        name: "userCreate",
        component: () => import("@/views/users/UserForm.vue"),
        meta: {
          requiresAdmin: true,
        },
      },
      {
        path: "master/users/:id/edit",
        name: "userEdit",
        component: () => import("@/views/users/UserForm.vue"),
        meta: {
          requiresAdmin: true,
        },
      },
      {
        path: "master/clients",
        name: "clientMaster",
        component: () => import("@/views/clients/ClientMaster.vue"),
      },
      {
        path: "master/clients/create",
        name: "clientCreate",
        component: () => import("@/views/clients/ClientForm.vue"),
        meta: {
          requiresAdmin: true,
        },
      },
      {
        path: "master/clients/:clientCode/edit",
        name: "clientEdit",
        component: () => import("@/views/clients/ClientForm.vue"),
        meta: {
          requiresAdmin: true,
        },
      },
      {
        path: "sales/orders",
        name: "orderList",
        component: () => import("@/views/orders/OrderList.vue"),
      },
      {
        path: "sales/orders/create",
        name: "orderReceiveCreate",
        component: () => import("@/views/orders/OrderCreate.vue"),
        meta: {
          requiresGeneral: true,
        },
      },
      {
        path: "sales/orders/create",
        name: "orderSaleCreate",
        component: () => import("@/views/orders/OrderCreate.vue"),
        meta: {
          requiresGeneral: true,
        },
      },
      {
        path: "sales/orders/:orderNo/edit",
        name: "orderEdit",
        component: () => import("@/views/orders/OrderEdit.vue"),
        meta: {
          requiresGeneral: true,
        },
      },
      {
        path: "master/products",
        name: "productMaster",
        component: () => import("@/views/products/ProductMaster.vue"),
      },
      {
        path: "master/products/create",
        name: "productCreate",
        component: () => import("@/views/products/ProductForm.vue"),
        meta: {
          requiresAdmin: true,
        },
      },
      {
        path: "master/products/:productCode/edit",
        name: "productEdit",
        component: () => import("@/views/products/ProductForm.vue"),
        meta: {
          requiresAdmin: true,
        },
      },
      {
        path: "errors/authError",
        name: "authError",
        component: () => import("@/views/errors/AuthError.vue"),
      },
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
  // ログインされていない場合にログイン画面に遷移する
  if (to.name !== "login" && !Auth.isLogin()) {
    return "/login";
  }

  // 権限チェック
  const authErrorPath = "/errors/authError";
  if (Auth.isAdmin() && to.meta.requiresGeneral) {
    // 管理者権限で一般専用画面にアクセスした場合
    return authErrorPath;
  } else if (!Auth.isAdmin() && to.meta.requiresAdmin) {
    // 一般権限で管理者専用画面にアクセスした場合
    if (to.name === "userEdit") {
      if (Auth.getLoginInfo().userId === to.params.id) {
        // ユーザー編集画面はログインしたユーザー自身のみを編集可能とする
        return;
      }
    }
    return authErrorPath;
  }
});
export default router;
