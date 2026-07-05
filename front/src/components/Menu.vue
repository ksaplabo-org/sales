<template>
  <div class="sidebar navbar-nav bg-dark text-white flex-shrink-0">
    <div class="d-flex align-items-center px-3" style="height: 56px">
      <i class="fas fa-layer-group me-2"></i>
      <span class="fw-bold">販売管理システム</span>
    </div>

    <!-- メニュー -->
    <div class="py-2">
      <div v-for="(group, index) in displayMenus" :key="group.group" class="mb-1">
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
import { computed, ref, onMounted } from "vue";
import * as Auth from "@/utils/auth.js";

// メニューに表示する一覧
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
        roles: ["2"],
      },
    ],
  },
  {
    group: "販売管理",
    icon: "fa-shopping-cart",
    open: true,
    menus: [],
  },
]);

const toggleMenu = (index) => {
  menus.value = menus.value[index].open = !menus.value[index].open;
};

// 表示するメニューを絞り込む
const displayMenus = computed(() => {
  return menus.value
    .map((group) => ({
      ...group,
      menus: group.menus.filter((menu) => menu.roles.includes(Auth.currentUserInfo().role)),
    }))
    .filter((group) => group.menus.length > 0);
});
</script>
