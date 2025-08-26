import Vue from "vue";
import Router from "vue-router";

import SignIn from "./views/SignIn.vue";
import SignOut from "./views/SignOut.vue";
import Top from "./views/Top.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/pages/sign-in.html",
      name: "signIn",
      props: true,
      component: SignIn,
    },
    {
      path: "/pages/sign-out.html",
      name: "signOut",
      component: SignOut,
    },
    {
      path: "/pages/top.html",
      name: "top",
      component: main,
    },
  ],
});
