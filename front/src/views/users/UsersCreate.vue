<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">ユーザー情報登録</h1>
          <button type="button" class="btn btn-dark mb-4" v-on:click="() => $router.push({ name: 'usersList' })">
            ユーザー情報一覧画面へ
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <div class="col-lg-5 mx-auto center-block mt-4">
            <!-- ユーザーID -->
            <div class="form-group row">
              <label class="col-lg-6"><span class="text-danger">*</span>ユーザーID</label>
              <div class="col-lg-6">
                <input autocomplete="new-password" v-model="userId" class="form-control h5" />
                <!-- ユーザーIDエラーメッセージ -->
                <div class="text-danger small" v-show="userIdErrMsg">{{ userIdErrMsg }}</div>
              </div>
            </div>

            <!--パスワード -->
            <div class="form-group row">
              <label class="col-lg-6"><span class="text-danger">*</span>パスワード</label>
              <div class="col-lg-6">
                <input autocomplete="new-password" type="password" v-model="userPass" class="form-control h5" />
                <!-- パスワードエラーメッセージ -->
                <div class="text-danger small" v-show="userPassErrMsg">{{ userPassErrMsg }}</div>
              </div>
            </div>

            <!-- ユーザー名 -->
            <div class="form-group row">
              <label class="col-lg-6"><span class="text-danger">*</span>ユーザー名</label>
              <div class="col-lg-6">
                <input v-model="userName" class="form-control h5" />
                <!-- ユーザー名エラーメッセージ -->
                <div class="text-danger small" v-show="userNameErrMsg">{{ userNameErrMsg }}</div>
              </div>
            </div>

            <!-- 権限 -->
            <div class="form-group row">
              <label class="col-lg-6">権限</label>
              <div class="col-lg-6">
                <select v-model="selectedUserRole" class="form-control h5">
                  <option v-for="userRole in userRoles" :value="userRole.value">{{ userRole.label }}</option>
                </select>
              </div>
            </div>
          </div>
          <!-- 登録・キャンセルボタン -->
          <div class="form-group justify-content-center row">
            <div class="mb-3 col-lg-4">
              <button
                :disabled="userId == '' || userPass == '' || userName == ''"
                class="btn btn-primary btn-lg btn-block"
                v-on:click="usersCreate()"
              >
                登録
              </button>
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
import CancelButton from "@/components/CancelButton.vue";
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
import UserConst from "@/utils/const/UserConst";
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as UserUtil from "@/utils/UserUtil";
export default {
  components: { Header, Loading, CancelButton },
  data() {
    return {
      isLoading: false,

      //各項目初期値
      userId: "",
      userPass: "",
      userName: "",
      selectedUserRole: UserConst.UserRole.general, // 初期値は一般権限

      // 選択項目
      userRoles: [
        { label: "一般", value: UserConst.UserRole.general },
        { label: "管理", value: UserConst.UserRole.admin },
        { label: "役職", value: UserConst.UserRole.post },
      ],

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
    } catch (e) {
      this.errMsg = e.message;
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    async usersCreate() {
      this.isLoading = true;
      //   エラーメッセージ初期化
      this.userIdErrMsg = "";
      this.userPassErrMsg = "";
      this.userNameErrMsg = "";

      let errFlag = false;

      try {
        // ユーザーID入力チェック
        if (this.userId == null || this.userId === "") {
          this.userIdErrMsg = "ユーザーIDが未入力です。";
          errFlag = true;
        } else if (!String(this.userId).match("^[A-Za-z0-9]+$")) {
          this.userIdErrMsg = "ユーザーIDは半角英数字で入力してください。";
          errFlag = true;
        } else if (String(this.userId).length > 4) {
          this.userIdErrMsg = "ユーザーIDは4字以内で入力してください。";
          errFlag = true;
        } else {
          // 同じユーザーIDが登録されていないかチェック
          const response = await AjaxUtil.getUsersByUserId(this.userId);
          const user = JSON.parse(response.data.Items);
          if (user) {
            this.userIdErrMsg = "既に同一のユーザーIDが登録されています。";
            errFlag = true;
          }
        }

        // パスワード入力チェック
        if (this.userPass == null || this.userPass === "") {
          this.userPassErrMsg = "パスワードが未入力です。";
          errFlag = true;
        } else if (!String(this.userPass).match("^[A-Za-z0-9]+$")) {
          this.userPassErrMsg = "パスワードは半角英数字で入力してください。";
          errFlag = true;
        } else if (String(this.userPass).length < 8 || String(this.userPass).length > 20) {
          this.userPassErrMsg = "パスワードは8字以上20字以内で入力してください。";
          errFlag = true;
        }

        // ユーザー名入力チェック
        if (this.userName == null || this.userName === "") {
          this.userNameErrMsg = "ユーザー名が未入力です。";
          errFlag = true;
        } else if (String(this.userName).length > 20) {
          this.userNameErrMsg = "ユーザー名は20字以内で入力してください。";
          errFlag = true;
        }

        if (errFlag) {
          return;
        }

        const userModel = {
          userId: this.userId,
          userPass: this.userPass,
          userName: this.userName,
          userRole: this.selectedUserRole,
        };

        // 登録
        await AjaxUtil.postUsers(userModel);
        alert("ユーザー情報登録処理が完了しました。");
        // 一覧画面に遷移する
        this.$router.push({ name: "usersList" });
      } catch (e) {
        if (e.response.status === 400) {
          alert("ユーザー情報の登録上限を超えています。");
          this.$router.push({ name: "usersCreate" });
        } else {
          alert("ユーザー情報登録処理に失敗しました。");
        }
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
