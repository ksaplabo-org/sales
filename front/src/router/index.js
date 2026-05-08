import { createRouter, createWebHistory } from "vue-router";

import Login from "@/views/Login.vue";
import Top from "@/views/Top.vue";
import UserList from "@/views/users/UserList.vue";

const router = createRouter({
  // envファイルのBASE_URLをimport
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/pages/login.html",
      name: "login",
      props: true,
      component: Login,
    },
    {
      path: "/pages/top.html",
      name: "top",
      component: Top,
    },
    {
      path: "/pages/users/list.html",
      name: "userList",
      component: UserList,
    },
  ],
});

export default router;
