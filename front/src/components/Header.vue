<template>
  <div>
    <nav class="navbar navbar-expand navbar-dark bg-dark static-top">
      <a href="/public/pages/menu.html" style="text-decoration: none; color: white"><h1>販売管理システム</h1></a>
      s
      <!-- Navbar Search(なし) -->
      <form class="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0"></form>
      <!-- Navbar -->
      <ul class="navbar-nav ml-auto ml-md-0">
        <div class="container text-center">
          <div v-if="isLogIn" class="row">
            <p class="text-white h5">ログイン中のユーザー名：</p>
            <p v-html="userName" class="mr-3 text-white h5"></p>
            <button class="btn-light btn-sm" v-on:click="logOut()">ログアウト</button>
          </div>
        </div>
      </ul>
    </nav>
  </div>
</template>
<script>
import * as UserUtil from "@/utils/UserUtil";
export default {
  data() {
    return {
      isLogIn: false,
      userName: "",
    };
  },
  async mounted() {
    this.isLogIn = UserUtil.isLogIn();
    const query = this.$route.query;
    this.userName = query.userName ? query.userName : UserUtil.currentUserInfo().userName;
  },
  methods: {
    /*
     *ログアウト処理
     */
    logOut: async function () {
      try {
        await UserUtil.deleteCurrentUserInfo();
        this.$router.push({ name: "logIn", params: { flashMsg: "ログアウトしました" } });
      } catch (e) {
        this.msg = e.message;
        this.$router.push({ name: "logIn", params: { flashErrMsg: "ログアウト中にエラーが発生しました" } });
      }
    },
  },
};
</script>

