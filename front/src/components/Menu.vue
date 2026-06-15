<template>
  <!-- Menu -->
  <!--
  <ul class="sidebar navbar-nav bg-dark" ref="test">
    <li class="nav-item active">
      <router-link tag="a" class="nav-link" :to="{ name: 'top' }">
        <i class="fas fa-fw fa-tachometer-alt me-1"></i>
        <span>トップページ</span>
      </router-link>
    </li>
    <li v-for="(menu, i) in menuList" :key="`bad-sample_${i}`" class="nav-item active">
      <router-link tag="a" class="nav-link" :to="{ name: menu.name }">
        <i v-bind:class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </router-link>
    </li>
  </ul>
-->

  <div class="sidebar navbar-nav bg-dark text-white flex-shrink-0">
    <!-- ロゴ -->
    <div class="d-flex align-items-center px-3" style="height: 56px">
      <i class="fas fa-layer-group me-2"></i>
      <span class="fw-bold"> 販売管理システム </span>
    </div>

    <!-- メニュー -->
    <div class="py-2">
      <div v-for="(group, index) in menus" :key="group.group" class="mb-1">
        <!-- グループ -->
        <div
          class="d-flex justify-content-between align-items-center px-3 py-2 cursor-pointer user-select-none"
          @click="toggleMenu(index)"
        >
          <div>
            <i class="fas me-2" :class="group.icon"></i>

            {{ group.group }}
          </div>

          <i class="fas" :class="group.open ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        </div>

        <!-- 折りたたみ -->
        <BCollapse :model-value="group.open">
          <RouterLink
            v-for="menu in group.menus"
            :key="menu.title"
            :to="menu.to"
            class="d-flex align-items-center text-decoration-none text-light px-4 py-2"
            active-class="bg-primary"
          >
            <i class="fas me-2" :class="menu.icon"></i>

            {{ menu.title }}
          </RouterLink>
        </BCollapse>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const menus = ref([
  {
    group: "マスタ管理",
    icon: "fa-users-cog",
    open: true,
    menus: [
      {
        title: "ユーザーマスタ",
        icon: "fa-user",
        to: "/master/users",
      },
      {
        title: "商品マスタ",
        icon: "fa-box",
        to: "/master/item",
      },
    ],
  },
  {
    group: "販売管理",
    icon: "fa-shopping-cart",
    open: false,
    menus: [
      {
        title: "受注一覧",
        icon: "fa-file-alt",
        to: "/sales/order",
      },
      {
        title: "売上一覧",
        icon: "fa-chart-line",
        to: "/sales/result",
      },
    ],
  },
]);

const toggleMenu = (index) => {
  menus.value[index].open = !menus.value[index].open;
};

/*
import * as Auth from "@/utils/auth.js";

export default {
  data() {
    return {
      menuList: [
        { title: "ユーザーマスタ", name: "userList", icon: "fas fa-fw fa-user me-1", onlyAdmin: true },
        { title: "商品マスタ", name: "userList", icon: "fas fa-fw fa-user me-1", onlyAdmin: true },
        { title: "顧客マスタ", name: "userList", icon: "fas fa-fw fa-user me-1", onlyAdmin: true },
        { title: "発注管理", name: "userList", icon: "fas fa-fw fa-user me-1", onlyAdmin: true },
        { title: "納品管理", name: "userList", icon: "fas fa-fw fa-user me-1", onlyAdmin: true },
        { title: "売上一覧", name: "userList", icon: "fas fa-fw fa-user me-1", onlyAdmin: true },
      ],
      //.filter((e) => (!Auth.isAdmin() ? !e.onlyAdmin : true)),
    };
  },
  async mounted() {
    try {
      if (Auth.isLogin()) {
        this.msg = "";
      } else {
        this.$router.push({ name: "login", params: { flashMsg: "サインインしてください" } });
      }
    } catch (e) {
      this.errMsg = e.message;
    }
  },
};
*/
</script>
