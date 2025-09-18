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
              <label for="userId" class="col-lg-6">ユーザー名</label>
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
              <label for="userPass" class="col-lg-6">パスワード</label>
              <div class="col-lg-6">
                <input
                  type="text"
                  id="userPass"
                  class="form-control"
                  v-model="userPass"
                  placeholder="8字以上20字以内で入力してください"
                  autocomplete="off"
                />
                <div class="text-danger small newlineControl" v-show="userPassErrMsg">{{ userPassErrMsg }}</div>
              </div>
            </div>
            <div class="form-group row">
              <label for="userName" class="col-lg-6">ユーザー名</label>
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
                <select v-model="userRole">
                  <option value=this.general>一般</option>
                  <option value= this.admin>管理者</option>
                  <option value=this.post>役職</option>
                </select>
                <div class="text-danger small newlineControl" v-show="userRoleErrMsg">{{ userRoleErrMsg }}</div>
              </div>
            </div>
          </div>
          <!-- 修正・キャンセルボタン -->
          <div class="form-group justify-content-center row">
            <div class="mb-3 col-lg-4">
              <btn class="btn btn-info btn-lg btn-block" v-on:click="usersEdit()">修正</btn>
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
// 共通設定
import "../../utils/sb-admin";

// util関連
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";
import UserConst from "@/utils/const/UserConst";

// コンポーネント関連
import Header from "../../components/Header.vue";
import Loading from "../../components/Loading.vue";
import CancelButton from "../../components/CancelButton.vue";
import Table from "../../components/Table.vue";

export default {
  components: { Header, Loading, CancelButton, Table },
  data() {
    return {
      isLoading: false,

      //テーブル用
      items: [],
      fields: [],
      tmpProductRow: null,

      //各項目初期値
      id:"",
      userId: "",
      userPass: "",
      userName: "",
      userRole: "",

      general: UserConst.UserRole.general,
      admin: UserConst.UserRole.admin,
      post: UserConst.UserRole.post,

      //エラーメッセージ
      errMsg: "",
      userIdErrMsg: "",
      userPassErrMsg: "",
      userNameErrMsg: "",
      userRoleErrMsg:"",
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
      }

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
      // 編集対象の伝票番号を設定する
      this.id = query.id;

      try {
        // 伝票番号から顧客・商品情報を結合した受注情報を取得
        // const response = await AjaxUtil.getUsersById(this.id);
        const response = await AjaxUtil.getUsersById(1);
        const userData = JSON.parse(response.data.Items);

        // 受注情報を各項目にセット
        this.userId = userData.userId,
        this.userPass = userData.userPass;
        this.userName=userData.userName;
        this.userRole=userData.userRole;

      } catch (e) {
        this.errMsg = "受注情報取得処理に失敗しました。";
        console.log(e);
      }
    },

    /**
     * 受注情報更新
     */
    async ordersEdit() {
      this.isLoading = true;
      // メッセージ初期化
      this.errMsg= "";
      this.userIdErrMsg= "";
      this.userPassErrMsg= "";
      this.userNameErrMsg= "";
      this.userRoleErrMsg="";

      // エラーが1つでもあるかどうかチェックする用
      let isErr = false;

      try {
        // 入力チェック
        if (this.userId == null || this.userId === "") {
          this.userIdErrMsg = "発注日が未入力です。";
          isErr = true;
        }
        if (this.userPass == null || this.userPass === "") {
          this.userPassErrMsg = "出荷日が未入力です。";
          isErr = true;
        }
        if (this.userNameDate == null || this.userNameDate === "") {
          this.userNameErrMsg = "納品日が未入力です。";
          isErr = true;
        }
        if (this.userId>4) {
          this.userIdErrMsg = "数量が誤っています。1以上かつ2桁以内で入力してください。";
          isErr = true;
        }
        if (this.userPass<0||this.userPass>20) {
          this.userPassErrMsg = "数量が誤っています。1以上かつ2桁以内で入力してください。";
          isErr = true;
        }
                if (this.userName>20) {
          this.userNameErrMsg = "数量が誤っています。1以上かつ2桁以内で入力してください。";
          isErr = true;
        }

               const response = await AjaxUtil.getUsersById(this.userId);
        const userInfo = JSON.parse(response.data.Items);
        if (userInfo) {
          this.userIderrMsg = "入力されたユーザーは既に登録されています";
          return;
        }

        if (!this.userId.match("^[0-9a-zA-Z]*$") ) {
          this.userIdErrMsg = "郵便番号は半角数字で入力してください。";
          errFlag = true;
        }
                if (!this.userPass.match("^[0-9a-zA-Z]*$") ) {
          this.userPassErrMsg = "郵便番号は半角数字で入力してください。";
          errFlag = true;
        }
        // エラーが1つでもあった(trueの)場合、処理を終了
        if (isErr) {
          return;
        }
        // 引数格納
        const usersModel = {
          id:this.id,
          userId:this.userId,
          userPass:this.userPass,
          userName:this.userName,
          userRole:this.userRole,
        };

        // 受注情報修正処理
        await AjaxUtil.putUsers(usersModel);

        window.alert("ユーザー情報修正処理が完了しました。");
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
