import Vue from "vue";
import Router from "vue-router";

import LogIn from "./views/LogIn.vue";
import Menu from "./views/Menu.vue";
import ClientsList from "./views/Clients/ClientsList.vue";
import ClientsCreate from "./views/Clients/ClientsCreate.vue";
import ClientsEdit from "./views/Clients/ClientsEdit.vue";
import ClientsDelete from "./views/Clients/ClientsDelete.vue";
import OrdersList from "./views/Orders/OrdersList.vue";
import OrdersCreate from "./views/Orders/OrdersCreate.vue";
import OrdersEdit from "./views/Orders/OrdersEdit.vue";
import OrdersDelete from "./views/Orders/OrdersDelete.vue";
import ProductsList from "./views/Products/ProductsList.vue";
import ProductsCreate from "./views/Products/ProductsCreate.vue";
import ProductsEdit from "./views/Products/ProductsEdit.vue";
import ProductsDelete from "./views/Products/ProductsDelete.vue";
import UsersList from "./views/Users/UsersList.vue";
import UsersCreate from "./views/Users/UsersCreate.vue";
import UsersEdit from "./views/Users/UsersEdit.vue";
import UsersDelete from "./views/Users/UsersDelete.vue";
import Sorry from "./views/Sorry.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/pages/log-in.html",
      name: "logIn",
      props: true,
      component: LogIn,
    },
    {
      path: "/pages/menu.html",
      name: "menu",
      component: Menu,
    },
     {
      path: "/pages/clients/list.html",
      name: "clientsList",
      component: ClientsList,
    },
    {
      path: "/pages/clients/create.html",
      name: "clientsCreate",
      component: ClientsCreate,
    },
    {
      path: "/pages/clients/edit.html",
      name: "clientsEdit",
      component: ClientsEdit,
    },
    {
      path: "/pages/clients/delete.html",
      name: "clientsDelete",
      component: ClientsDelete,
    },
    {
      path: "/pages/orders/list.html",
      name: "ordersList",
      component: OrdersList,
    },
    {
      path: "/pages/orders/create.html",
      name: "ordersCreate",
      component: OrdersCreate,
    },
    {
      path: "/pages/orders/edit.html",
      name: "ordersEdit",
      component: OrdersEdit,
    },
    {
      path: "/pages/orders/delete.html",
      name: "ordersDelete",
      component: OrdersDelete,
    },
        {
      path: "/pages/products/list.html",
      name: "productsList",
      component: ProductsList,
    },
    {
      path: "/pages/products/create.html",
      name: "productsCreate",
      component: ProductsCreate,
    },
    {
      path: "/pages/products/edit.html",
      name: "productsEdit",
      component: ProductsEdit,
    },
    {
      path: "/pages/products/delete.html",
      name: "productsDelete",
      component: ProductsDelete,
    },
    {
      path: "/pages/users/list.html",
      name: "usersList",
      component: UsersList,
    },
    {
      path: "/pages/users/create.html",
      name: "usersCreate",
      component: UsersCreate,
    },
    {
      path: "/pages/users/edit.html",
      name: "usersEdit",
      component: UsersEdit,
    },
    {
      path: "/pages/users/delete.html",
      name: "usersDelete",
      component: UsersDelete,
    },
     {
      path: "*",
      name: "sorry",
      component: Sorry,
    },
  ],
});
