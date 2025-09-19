<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark static-top">
    <!-- タイトル(ログイン中はクリックでメニュー画面へ遷移可能) -->
    <h1
      class="text-white"
      v-on:click="onClickTitle()"
      :style="{ cursor: isLogIn ? 'pointer' : 'default' }"
    >
      販売管理システム
    </h1>

    <!-- ログイン中のユーザー名表示とログアウトボタン -->
    <div class="ml-auto my-auto">
      <div class="container text-center">
        <div v-if="isLogIn" class="row text-white">
          <h5>ログイン中のユーザー名：</h5>
          <h5 v-show="userName" class="mr-3">{{ userName }}</h5>
          <button class="btn btn-light btn-sm" v-on:click="logOut()">ログアウト</button>
        </div>
      </div>
    </div>
  </nav>
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
    this.userName = UserUtil.currentUserInfo().userName;
  },
  methods: {
    /*
     *ログアウト処理
     */
    logOut() {
      try {
        UserUtil.deleteCurrentUserInfo();
        this.$router.push({ name: "logIn", params: { flashMsg: "ログアウトしました" } });
      } catch (e) {
        this.$router.push({ name: "logIn", params: { flashErrMsg: "ログアウト中にエラーが発生しました" } });
      }
    },

    /*
     *タイトル押下時処理(メニュー画面遷移)
     */
    onClickTitle() {
      // ログイン中のみ、メニューへ遷移可能
      if (this.isLogIn) {
        this.$router.push({ name: "menu" });
      }
    },
  },
};
</script>
