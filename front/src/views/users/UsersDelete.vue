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
          <br />
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

          <form @submit.stop.prevent="usersDelete" method="post">
            <div class="col-sm-5 mx-auto center-block">
              <div class="" />

              <!-- ユーザーID -->
              <div class="form-group row">
                <label class="col-sm-6">ユーザーID</label>
                <p v-show="userId" class="col-sm-6 h5">{{ userId }}</p>
              </div>

              <!-- パスワード -->
              <div class="form-group row">
                <label class="col-sm-6">パスワード</label>
                <p v-show="password" class="col-sm-6 h5">{{ password }}</p>
              </div>

              <!-- ユーザー名 -->
              <div class="form-group row">
                <label class="col-sm-6">ユーザー名</label>
                <p v-show="userName" class="col-sm-6 h5">{{ userName }}</p>
              </div>

              <!-- 権限 -->
              <div class="form-group row">
                <label class="col-sm-6">権限</label>
                <p v-show="userRole" class="col-sm-6 h5">{{ userRole }}</p>
              </div>
            </div>

            <!-- 削除ボタン -->
            <div class="form-group justify-content-center row">
              <div class="col-sm-6">
                <input
                  class="btn btn-danger btn-sm btn-block"
                  type="submit"
                  value="削除"
                  :disabled="this.userInfo.id == this.id"
                />
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
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";
import UserConst from "@/utils/const/UserConst";
// 共通
import Header from "../../components/Header.vue";
import "../../utils/sb-admin";
import Loading from "../../components/Loading.vue";
import CancelButton from "../../components/CancelButton.vue";
export default {
  props: ["flashMsg", "flashErrMsg"],
  components: { Header, Loading, CancelButton },
  data() {
    return {
      //各項目初期値
      errMsg: "",
      isLoading: false,
      id: "",
      userId: "",
      password: "",
      userName: "",
      userRole: "",
      userInfo: "",
    };
  },
  async mounted() {
    try {
      this.userInfo = UserUtil.currentUserInfo();
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });

        //権限チェック(管理者以外拒否)
      } else if (this.userInfo.userRole != UserConst.UserRole.admin) {
        this.$router.push({ name: "logIn", params: { flashMsg: "権限がありません" } });
      }

      // メッセージ設定
      this.msg = this.flashMsg;
      this.errMsg = this.flashErrMsg;

      //画面更新処理
      await this.updateView();
    } catch (e) {
      this.errMsg = e.message;
    }
  },
  methods: {
    /**
     * 画面更新
     */
    async updateView() {
      this.isLoading = true;

      //クエリストリングを取得
      const query = this.$route.query;
      //削除対象の管理用IDを設定する
      this.id = query.id;

      try {
        // 管理用IDからユーザー情報を取得
        const response = await AjaxUtil.getUsersByid(this.id);
        const userData = JSON.parse(response.data.Items);

        //パスワードの文字数分の●を表示
        const passLength = userData.user_pass.length;
        for (let i = 0; i < passLength; i++) {
          this.password += "●";
        }

        //user_roleの値に応じた権限を表示
        switch (userData.user_role) {
          case 0:
            this.userRole = "一般";
            break;
          case 1:
            this.userRole = "管理者";
            break;
          case 2:
            this.userRole = "役職";
            break;
        }

        // ユーザー情報を各項目にセット
        this.userId = userData.user_id;
        this.userName = userData.user_name;

        //ログイン中ユーザー一致チェック
        if(this.userInfo.id==this.id){
          window.alert("ログイン中のユーザーは削除できません。");
        }
      } catch (e) {
        this.errMsg = "ユーザー情報取得に失敗しました";
        console.log(e);
      }
      this.isLoading = false;
    },

    /**
     * ユーザー情報削除
     */
    async usersDelete() {
      // メッセージ初期化
      this.errMsg = "";
      this.isLoading = true;
      try {
        //削除確認用ポップアップを表示
        const comfirmResult = window.confirm("本当に削除しますか?");
        //Ok(true)の場合実行
        if (comfirmResult) {
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
