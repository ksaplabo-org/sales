<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">受注情報修正</h1>
          <button type="button" class="btn btn-dark mb-4" v-on:click="() => $router.push({ name: 'ordersList' })">
            受注情報一覧画面へ
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

          <div class="col-lg-5 mx-auto center-block">
            <div class="" />

            <!-- ユーザーID -->
            <div class="form-group row">
              <label class="col-lg-6">ユーザーID</label>
              <input v-model="userId" class="form-control col-lg-6 h5" />
            </div>

            <!--パスワード -->
            <div class="form-group row">
              <label class="col-lg-6">パスワード</label>
              <input v-model="userPass" class="form-control col-lg-6 h5" />
            </div>

            <!-- ユーザー名 -->
            <div class="form-group row">
              <label class="col-lg-6">ユーザー名</label>
              <input v-model="userName" class="form-control col-lg-6 h5" />
            </div>

            <!-- 権限 -->
            <div class="form-group row">
              <label class="col-lg-6">権限</label>
              <select v-model="userRole" class="form-control col-lg-6 h5">
                <option :value="UserConst.UserRole.general">一般</option>
                <option :value="UserConst.UserRole.general">役職</option>
                <option :value="UserConst.UserRole.general">管理</option>
              </select>
            </div>
          </div>
          <!-- 登録・キャンセルボタン -->
          <div class="form-group justify-content-center row">
            <div class="mb-3 col-lg-4">
              <btn class="btn btn-primary btn-lg btn-block" v-on:click="ordersEdit()">登録</btn>
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

export default {
  components: { Header, Loading, CancelButton },
  data() {
    return {
      isLoading: false,

      //各項目初期値
      userId: "",
      userPass: "",
      userName: "",
      userRole: UserConst.UserRole.general,

      updateId: "",
      //エラーメッセージ
      errMsg: "",
      userIdErrMsg: "",
      userPassErrMsg: "",
      userNameErrMsg: "",
      userRoleErrMsg: "",
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
    async clientsCreate() {
      this.isLoading = true;
      //   エラーメッセージ初期化
      this.userIdErrMsg = "";
      this.userPassErrMsg = "";
      this.userNameErrMsg = "";
      this.userRoleErrMsg = "";

      let errFlag = false;

      try {
        if (this.name == null || this.name === "") {
          this.nameErrMsg = "顧客名が未入力です。";
          errFlag = true;
        }
        if (this.name.length > 20) {
          this.nameErrMsg = "顧客名は20字以下で入力してください。";
          errFlag = true;
        }
        if ((this.postCode1 || this.postCode2) && (this.postCode1.length != 3 || this.postCode2.length != 4)) {
          this.postCodeErrMsg = "正しい郵便番号を入力してください。";
          errFlag = true;
        }
        if (this.address1.length > 20) {
          this.address1ErrMsg = "住所１は20字以内で入力してください。";
          errFlag = true;
        }
        if (this.address2.length > 20) {
          this.address2ErrMsg = "住所２は20字以内で入力してください。";
          errFlag = true;
        }
        if (this.telNo.length > 20) {
          this.telNoErrMsg = "電話番号は20字以内で入力してください。";
          errFlag = true;
        }
        if (!this.postCode1.match("^[0-9]*$") || !this.postCode2.match("^[0-9]*$")) {
          this.postCodeErrMsg = "郵便番号は半角数字で入力してください。";
          errFlag = true;
        }
        if (this.telNo != null && this.telNo !== "" && !this.telNo.match("^[0-9][0-9-]*$")) {
          this.telNoErrMsg = "電話番号は半角数字と-(半角ハイフン)のみで入力してください。";
          errFlag = true;
        }
        if (errFlag) {
          return;
        }

        const userModel = {
          userId: this.userId,
          userPass: this.userPass,
          userName: this.userName,
          userRole: this.userRole,
        };
        // 登録
        await AjaxUtil.postUsers(userModel);
        alert("ユーザー情報登録処理が完了しました。");
        // 一覧画面に遷移する
        this.$router.push({ name: "usersList" });
      } catch (e) {
        if (e.response.status === 400) {
          this.msg = "";
          alert("ユーザー情報の登録上限を超えています。");
          console.log(e);
          this.$router.push({ name: "usersList" });
        } else {
          this.msg = "";
          alert("ユーザー情報登録に失敗しました。");
          console.log(e);
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
