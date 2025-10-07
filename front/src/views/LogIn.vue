<template>
  <div class="bg-light min-vh-100">
    <Header />
    <div class="container">
      <div class="card card-login mx-auto mt-5">
        <div class="card-header text-left">ログイン</div>
        <div class="card-body text-left">
          <form @submit.stop.prevent="logIn" method="post">
            <!-- ユーザーID入力欄 -->
            <div class="form-group">
              <div class="form-label-group">
                <input
                  type="text"
                  id="userId"
                  class="form-control"
                  placeholder="User ID"
                  autofocus="autofocus"
                  v-model="userId"
                  autocomplete="off"
                />
                <label for="userId">ユーザーID</label>
              </div>
            </div>

            <!-- パスワード入力欄 -->
            <div class="form-group">
              <div class="form-label-group">
                <input
                  type="password"
                  id="inputUserPass"
                  class="form-control"
                  placeholder="Password"
                  required="required"
                  v-model="userPass"
                  autocomplete="off"
                  pattern="^[0-9A-Za-z]+$"
                />
                <label for="inputUserPass">パスワード</label>
              </div>
            </div>

            <!-- メッセージ表示 -->
            <div class="form-group">
              <div class="form-label-group">
                <div>
                  <label>
                    <span class="text-primary" v-show="msg">{{ msg }}</span>
                    <span class="text-danger" v-show="errMsg">{{ errMsg }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- ログインボタン -->
            <input
              class="btn btn-primary btn-block"
              type="submit"
              value="ログイン"
              :disabled="userId == '' || userPass == ''"
            />
          </form>

          <div class="text-center"></div>
        </div>
      </div>

      <!-- ローディングマスク -->
      <loading v-if="isLoading === true" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";

import * as AjaxUtil from "@/utils/AjaxUtil";
import UserConst from "@/utils/const/UserConst";


export default {
  props: ["flashMsg", "flashErrMsg"],
  components: { Header, Loading },
  data() {
    return {
      userId: "",
      userPass: "",
      errMsg: this.flashErrMsg,
      msg: this.flashMsg,
      isLoading: false,
    };
  },
  methods: {
    /**
     * ログイン処理
     */
    async logIn() {
      this.msg = "";
      this.errMsg = "";
      this.isLoading = true;

      try {
        // ログイン情報を取得
        const response = await AjaxUtil.logIn(this.userId, this.userPass);
        // セッションストレージにLOGIN_KEYとしてログイン情報を保存
        sessionStorage.setItem(UserConst.SessionKey, JSON.stringify(response.data));
        this.$router.push({ name: "menu" });
      } catch (e) {
        if (e.response.status === 401) {
          this.errMsg = "ユーザーIDまたはパスワードが誤っています。";
        } else {
          this.errMsg = "ログインに失敗しました。";
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
