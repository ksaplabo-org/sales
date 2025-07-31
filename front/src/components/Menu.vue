<template>
  <!-- Menu -->
  <ul class="sidebar navbar-nav" ref="test">
    <li class="nav-item active">
      <router-link tag="a" class="nav-link" :to="{ name: 'top' }">
        <i class="fas fa-fw fa-tachometer-alt"></i>
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
</template>

<script>
import * as UserUtil from "@/utils/UserUtil";

export default {
  data() {
    /**
     * メニュー定義
     *    title: タイトル
     *    name: ルーティングする名称
     *    icon: Font Awesomeのアイコンを指定
     *    onlyAdmin: true:管理者のみ/false:管理者、一般で使用可能
     */
    return {
      menuList: [
        //{ title: "ユーザー一覧", name: "userList", icon: "fas fa-fw fa-user", onlyAdmin: true },
      ].filter((e) => (!UserUtil.isAdmin() ? !e.onlyAdmin : true)),
    };
  },
  async mounted() {
    try {
      if (UserUtil.isSignIn()) {
        this.msg = "";
      } else {
        this.$router.push({ name: "signIn", params: { flashMsg: "サインインしてください" } });
      }
    } catch (e) {
      this.errMsg = e.message;
    }
  },
};
</script>
