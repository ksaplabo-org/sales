<script setup>
import { RouterView } from "vue-router";
import NaviMenu from "@/components/NaviMenu.vue";
import Menu from "@/components/Menu.vue";
import ScrollTop from "@/components/ScrollTop.vue";

import * as Auth from "@/utils/auth.js";
</script>

<template>
  <!-- ログイン以外の画面 -->
  <div v-if="Auth.isLogin()">
    <NaviMenu />
    <div id="wrapper" class="bg-light">
      <Menu />
      <div id="content-wrapper" class="container-fluid">
        <RouterView />
      </div>
    </div>
  </div>

  <!-- ログイン画面 -->
  <div v-else>
    <RouterView />
  </div>
  <!-- スクロールトップボタン -->
  <ScrollTop />
</template>
