<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">ユーザー情報修正</h1>
          <button type="button" class="btn btn-dark mb-4" v-on:click="() => $router.push({ name: 'usersList' })">
            ユーザー情報一覧画面へ
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

          <div class="col-lg-5 mx-auto center-block">
            <div class="" />
            <div class="form-group row">
              <label for="userId" class="col-lg-6">ユーザーID<label class="text-danger">*</label></label>
              <div class="col-lg-6">
                <input
                  type="text"
                  id="userId"
                  class="form-control"
                  v-model="userId"
                  placeholder="1字以上4字以内で入力してください"
                  autocomplete="off"
                />
                <div class="text-danger small newlineControl" v-show="userIdErrMsg">{{ userIdErrMsg }}</div>
              </div>
            </div>
            <div class="form-group row">
              <label for="userPass" class="col-lg-6">パスワード<label class="text-danger">*</label></label>
              <div class="col-lg-6">
                <input
                  type="password"
                  id="userPass"
                  class="form-control"
                  v-model="userPass"
                  placeholder="8字以上20字以内で入力してください"
                  autocomplete="new-password"
                />
                <div class="text-danger small newlineControl" v-show="userPassErrMsg">{{ userPassErrMsg }}</div>
              </div>
            </div>
            <div class="form-group row">
              <label for="userName" class="col-lg-6">ユーザー名<label class="text-danger">*</label></label>
              <div class="col-lg-6">
                <input
                  type="text"
                  id="userName"
                  class="form-control"
                  v-model="userName"
                  placeholder="20字以内で入力してください"
                  autocomplete="off"
                />
                <div class="text-danger small newlineControl" v-show="userNameErrMsg">{{ userNameErrMsg }}</div>
              </div>
            </div>
            <div class="form-group row">
              <label for="userRole" class="col-lg-6">権限</label>
              <div class="col-lg-6">
                <select v-model="userRole" :disabled="this.logInId == this.id" class="form-control h5">
                  <option :value="this.general">一般</option>
                  <option :value="this.admin">管理者</option>
                  <option :value="this.post">役職</option>
                </select>
              </div>
            </div>
          </div>
          <!-- 修正・キャンセルボタン -->
          <div class="form-group justify-content-center row">
            <div class="mb-3 col-lg-4">
              <button type="button" class="btn btn-info btn-lg btn-block" v-on:click="usersEdit()">修正</button>
            </div>
            <div class="col-lg-4">
              <CancelButton />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- スクロールトップボタン -->
    <a class="scroll-to-top rounded" href="#page-top">
      <i class="fas fa-angle-up"></i>
    </a>

    <!-- ローディングマスク -->
    <loading v-if="isLoading === true" />
  </div>
</template>

<script>
// util関連
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";
import UserConst from "@/utils/const/UserConst";

// コンポーネント関連
import Header from "../../components/Header.vue";
import Loading from "../../components/Loading.vue";
import CancelButton from "../../components/CancelButton.vue";
import { currentUserInfo } from "../../utils/UserUtil";

export default {
  components: { Header, Loading, CancelButton },
  data() {
    return {
      isLoading: false,

      //各項目初期値
      id: "",
      userId: "",
      userPass: "",
      userName: "",
      userRole: "",

      logInId: "",

      general: UserConst.UserRole.general,
      admin: UserConst.UserRole.admin,
      post: UserConst.UserRole.post,

      //エラーメッセージ
      errMsg: "",
      userIdErrMsg: "",
      userPassErrMsg: "",
      userNameErrMsg: "",
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
      }
      this.logInId = UserUtil.currentUserInfo().id;
      // 画面更新処理を呼び出す
      await this.updateView();
    } catch (e) {
      this.errMsg = e.message;
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    /**
     * 画面更新
     */
    async updateView() {
      // クエリストリングを取得
      const query = this.$route.query;
      // 修正対象の管理用Idを設定する
      this.id = query.id;

      try {
        // 管理用Idからユーザー情報を取得
        const response = await AjaxUtil.getUsersById(this.id);
        // const response = await AjaxUtil.getUsersById(1);
        const userData = JSON.parse(response.data.Items);

        // ユーザー情報を各項目にセット
        this.userId = userData.user_id;
        this.userPass = userData.user_pass;
        this.userName = userData.user_name;
        this.userRole = userData.user_role;
      } catch (e) {
        this.errMsg = "ユーザー情報取得処理に失敗しました。";
        console.log(e);
      }
    },

    /**
     * 受注情報更新
     */
    async usersEdit() {
      this.isLoading = true;
      // メッセージ初期化
      this.errMsg = "";
      this.userIdErrMsg = "";
      this.userPassErrMsg = "";
      this.userNameErrMsg = "";

      // エラーが1つでもあるかどうかチェックする用
      let isErr = false;

      try {
        // 入力チェック
        if (this.userId == null || this.userId === "") {
          this.userIdErrMsg = "ユーザーIDが未入力です。";
          isErr = true;
        }
        if (this.userPass == null || this.userPass === "") {
          this.userPassErrMsg = "パスワードが未入力です。";
          isErr = true;
        }
        if (this.userName == null || this.userName === "") {
          this.userNameErrMsg = "ユーザー名が未入力です。";
          isErr = true;
        }
        if (this.userId.length > 4) {
          this.userIdErrMsg = "ユーザーIDは4字以内で入力してください。";
          isErr = true;
        }
        if (this.userPass.length < 8 || this.userPass.length > 20) {
          this.userPassErrMsg = "パスワードは8字以上20字以内で入力してください。";
          isErr = true;
        }
        if (this.userName.length > 20) {
          this.userNameErrMsg = "ユーザー名は20字以内で入力してください。";
          isErr = true;
        }

        if (!this.userId.match("^[0-9a-zA-Z]*$")) {
          this.userIdErrMsg = "ユーザーIDは半角英数字で入力してください。";
          isErr = true;
        }
        if (!this.userPass.match("^[0-9a-zA-Z]*$")) {
          this.userPassErrMsg = "パスワードは半角英数字で入力してください。";
          isErr = true;
        }
        const response = await AjaxUtil.getUsersByUserId(this.userId);
        const userInfo = JSON.parse(response.data.Items);
        if (userInfo && userInfo.id != this.id) {
          this.userIdErrMsg = "既に同一のユーザーIDが登録されています。";
          isErr = true;
        }
        // エラーが1つでもあった(trueの)場合、処理を終了
        if (isErr) {
          return;
        }

        // 引数格納
        const usersModel = {
          id: this.id,
          userId: this.userId,
          userPass: this.userPass,
          userName: this.userName,
          userRole: this.userRole,
        };

        // ユーザー情報修正処理
        await AjaxUtil.putUsers(usersModel);

        window.alert("ユーザー情報修正処理が完了しました。");
        if (this.logInId == this.id) {
          const newLogInInfo = {
            id: this.id,
            userName: this.userName,
            userRole: UserUtil.currentUserInfo().userRole,
          };
          sessionStorage.setItem(UserConst.SessionKey, JSON.stringify(newLogInInfo));
        }

        this.$router.push({ name: "usersList" });
      } catch (e) {
        window.alert("ユーザー情報修正処理に失敗しました。");
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
<style scoped>
@media screen and (min-width: 992px) {
  .newlineControl {
    white-space: nowrap;
  }
}
</style>
