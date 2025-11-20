<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">ユーザー情報削除</h1>
          <button class="btn btn-dark" v-on:click="() => $router.push({ name: 'usersList' })">
            ユーザー情報一覧画面へ
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <form @submit.stop.prevent="usersDelete" method="post">
            <div class="col-lg-5 mx-auto center-block mt-4">
              <!-- ユーザーID -->
              <div class="form-group row">
                <label class="col-lg-6">ユーザーID</label>
                <p v-show="userId" class="col-lg-6 h5">{{ userId }}</p>
              </div>

              <!-- パスワード -->
              <div class="form-group row">
                <label class="col-lg-6">パスワード</label>
                <p v-show="password" class="col-lg-6 h5">{{ password }}</p>
              </div>

              <!-- ユーザー名 -->
              <div class="form-group row">
                <label class="col-lg-6">ユーザー名</label>
                <p v-show="userName" class="col-lg-6 h5">{{ userName }}</p>
              </div>

              <!-- 権限 -->
              <div class="form-group row">
                <label class="col-lg-6">権限</label>
                <p v-show="userRole" class="col-lg-6 h5">{{ userRole }}</p>
              </div>
            </div>

            <!-- 削除ボタン -->
            <div class="form-group justify-content-center row">
              <div class="col-lg-6">
                <input class="btn btn-danger btn-sm btn-block" type="submit" value="削除" />
              </div>
            </div>
          </form>
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
// 共通
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as UserUtil from "@/utils/UserUtil";
import UserConst from "@/utils/const/UserConst";
export default {
  components: { Header, Loading },
  data() {
    return {
      isLoading: false,

      //各項目初期値
      id: "",
      userId: "",
      password: "",
      userName: "",
      userRole: "",
      loggedInId: "",

      errMsg: "",
    };
  },
  async mounted() {
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
      }
      this.isLoading = true;

      // ログイン中のIDを取得
      this.loggedInId = UserUtil.currentUserInfo().id;

      //画面更新処理
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
      //クエリストリングを取得
      const query = this.$route.query;

      try {
        // 管理用IDからユーザー情報を取得
        const response = await AjaxUtil.getUsersById(query.id);
        const userData = JSON.parse(response.data.Items);

        // 役職を値に応じてマッピングするための配列
        const roleMap = {
          [UserConst.UserRole.general]: "一般",
          [UserConst.UserRole.admin]: "管理者",
          [UserConst.UserRole.post]: "役職",
        };

        // ユーザー情報を各項目にセット
        this.id = userData.id;
        this.userId = userData.user_id;
        this.password = "●".repeat(userData.user_pass.length); // パスワードの文字数分の●を表示
        this.userName = userData.user_name;
        this.userRole = roleMap[userData.user_role];

        //ログイン中ユーザー一致チェック
        if (this.loggedInId == this.id) {
          window.alert("ログイン中のユーザーは削除できません。");
          this.$router.push({ name: "usersList" });
        }
      } catch (e) {
        this.errMsg = "ユーザー情報取得処理に失敗しました。";
        console.log(e);
      }
      this.isLoading = false;
    },

    /**
     * ユーザー情報削除
     */
    async usersDelete() {
      this.isLoading = true;
      try {
        //削除確認用ポップアップを表示
        const confirmResult = window.confirm("本当に削除しますか?");
        //OK(true)の場合実行
        if (confirmResult) {
          await AjaxUtil.deleteUsers(this.id);
          window.alert("ユーザー情報削除処理が完了しました。");
          this.$router.push({ name: "usersList" });
        }
      } catch (e) {
        window.alert("ユーザー情報削除処理に失敗しました。");
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
