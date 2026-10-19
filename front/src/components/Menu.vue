<template>
  <div class="sidebar navbar-nav bg-dark text-white flex-shrink-0" :class="{ collapsed: isCollapsed }">
    <div class="d-flex align-items-center px-3" style="height: 56px">
      <i class="fas fa-bars" @click="toggleSidebar"></i>
      <i class="fas fa-layer-group me-2"></i>
      <span v-if="!isCollapsed">
        <span class="fw-bold">販売管理システム</span>
      </span>
    </div>

    <!-- メニュー -->
    <div class="py-2">
      fa-bars me-3 cursor-pointer
      <div v-for="(group, index) in displayMenus" :key="group.group" class="mb-1">
        <div
          class="d-flex align-items-center px-3 py-2 cursor-pointer user-select-none"
          :class="isCollapsed ? 'justify-content-start gap-2' : 'justify-content-between'"
          @click="toggleMenu(index)"
        >
          <div>
            <i class="fas me-2" :class="group.icon"></i>
            <span v-if="!isCollapsed">
              {{ group.group }}
            </span>
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
            :class="isCollapsed ? 'justify-content-start px-0' : 'px-4'"
            active-class="bg-primary"
          >
            <i class="fas me-2" :class="[menu.icon, !isCollapsed ? 'me-2' : '']"></i>
            <span v-if="!isCollapsed">
              {{ menu.title }}
            </span>
          </RouterLink>
        </BCollapse>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import * as Auth from "@/utils/auth.js";

// サイドバー開閉フラグ
const isCollapsed = ref(false);

// サイドバー開閉
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

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
      {
        title: "取引先マスタ",
        icon: "fa-money-bill-wave",
        to: "/master/clients",
        roles: ["1", "2"],
      },
      {
        title: "商品マスタ",
        icon: "fa-solid fa-barcode",
        to: "/master/products",
        roles: ["1", "2"],
      },
      {
        title: "お知らせマスタ",
        icon: "fa-regular fa-envelope",
        to: "/master/notices",
        roles: ["2"],
      },
    ],
  },
  {
    group: "販売管理",
    icon: "fa-shopping-cart",
    open: true,
    menus: [
      {
        title: "受発注情報一覧",
        icon: "fa-file-invoice-dollar",
        to: "/sales/orders",
        roles: ["1", "2"],
      },
    ],
  },
]);

const toggleMenu = (index) => {
  menus.value[index].open = !menus.value[index].open;
};

// 表示するメニューを絞り込む
const displayMenus = computed(() => {
  return menus.value
    .map((group) => ({
      ...group,
      menus: group.menus.filter((menu) => menu.roles.includes(Auth.getLoginInfo().role)),
    }))
    .filter((group) => group.menus.length > 0);
});
</script>

<style scoped>
.sidebar.collapsed {
  width: 80px !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
