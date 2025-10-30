<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">ユーザー情報修正</h1>
          <button type="button" class="btn btn-dark" v-on:click="() => $router.push({ name: 'usersList' })">
            ユーザー情報一覧画面へ
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <div class="col-lg-5 mx-auto center-block mt-4">
            <!-- ユーザーID -->
            <div class="form-group row">
              <label for="userId" class="col-lg-6">ユーザーID<span class="text-danger">*</span></label>
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

            <!-- パスワード -->
            <div class="form-group row">
              <label for="userPass" class="col-lg-6">パスワード<span class="text-danger">*</span></label>
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

            <!-- ユーザー名 -->
            <div class="form-group row">
              <label for="userName" class="col-lg-6">ユーザー名<span class="text-danger">*</span></label>
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

            <!-- 権限 -->
            <div class="form-group row">
              <label for="selectedUserRole" class="col-lg-6">権限</label>
              <div class="col-lg-6">
                <select v-model="selectedUserRole" :disabled="this.loggedInId == this.id" class="form-control h5">
                  <option v-for="userRole in userRoles" :value="userRole.value">
                    {{ userRole.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <!-- 修正・キャンセルボタン -->
          <div class="form-group justify-content-center row">
            <div class="mb-3 col-lg-4">
              <button
                :disabled="userId == '' || userPass == '' || userName == ''"
                type="button"
                class="btn btn-info btn-lg btn-block"
                v-on:click="usersEdit()"
              >
                修正
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
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as UserUtil from "@/utils/UserUtil";
import UserConst from "@/utils/const/UserConst";
export default {
  components: { CancelButton, Header, Loading },
  data() {
    return {
      isLoading: false,

      //各項目初期値
      id: "",
      userId: "",
      originalUserId: "", // 情報取得時(変更前)のユーザーIDを保持する
      userPass: "",
      userName: "",
      loggedInId: "", // 現在ログイン中のユーザーの管理用IDを保持する
      selectedUserRole: "",
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
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
      }
      this.isLoading = true;

      // 現在ログイン中のユーザーの管理用IDを保持し、画面更新処理を呼び出す
      this.loggedInId = UserUtil.currentUserInfo().id;
      await this.updateView();

      // 更新対象がログイン中ユーザー(自分自身)の場合、権限は管理者固定
      if (this.loggedInId == this.id) {
        this.userRoles = [{ label: "管理", value: UserConst.UserRole.admin }];
      }
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

      try {
        // 管理用IDからユーザー情報を取得
        const response = await AjaxUtil.getUsersById(query.id);
        const userData = JSON.parse(response.data.Items);

        // ユーザー情報を各項目にセット
        this.id = userData.id;
        this.userId = userData.user_id;
        this.originalUserId = userData.user_id; // 変更前のユーザーIDを保持
        this.userPass = userData.user_pass;
        this.userName = userData.user_name;
        this.selectedUserRole = userData.user_role;
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
        // ユーザーIDの入力チェック
        if (this.userId == null || this.userId === "") {
          this.userIdErrMsg = "ユーザーIDが未入力です。";
          isErr = true;
        } else if (!this.userId.match("^[0-9a-zA-Z]*$")) {
          this.userIdErrMsg = "ユーザーIDは半角英数字で入力してください。";
          isErr = true;
        } else if (this.userId.length > 4) {
          this.userIdErrMsg = "ユーザーIDは4字以内で入力してください。";
          isErr = true;
          //ユーザーIDに変更がある場合のみ実行
        } else if (this.userId != this.originalUserId) {
          const response = await AjaxUtil.getUsersByUserId(this.userId);
          const userData = JSON.parse(response.data.Items);
          if (userData) {
            this.userIdErrMsg = "既に同一のユーザーIDが登録されています。";
            isErr = true;
          }
        }

        // パスワードの入力チェック
        if (this.userPass == null || this.userPass === "") {
          this.userPassErrMsg = "パスワードが未入力です。";
          isErr = true;
        } else if (!this.userPass.match("^[0-9a-zA-Z]*$")) {
          this.userPassErrMsg = "パスワードは半角英数字で入力してください。";
          isErr = true;
        } else if (this.userPass.length < 8 || this.userPass.length > 20) {
          this.userPassErrMsg = "パスワードは8字以上20字以内で入力してください。";
          isErr = true;
        }

        // ユーザー名の入力チェック
        if (this.userName == null || this.userName === "") {
          this.userNameErrMsg = "ユーザー名が未入力です。";
          isErr = true;
        } else if (this.userName.length > 20) {
          this.userNameErrMsg = "ユーザー名は20字以内で入力してください。";
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
          userRole: this.selectedUserRole,
        };

        // ユーザー情報更新処理
        await AjaxUtil.putUsers(usersModel);
        // ログイン中ユーザー(自分自身)を更新した場合、更新内容をセッション情報に反映する
        if (this.loggedInId == this.id) {
          const loginInfoAfterUpdate = {
            id: this.id,
            userName: this.userName,
            selectedUserRole: this.UserRole,
          };
          sessionStorage.setItem(UserConst.SessionKey, JSON.stringify(loginInfoAfterUpdate));
        }
        // メッセージと画面遷移
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
<style scoped>
@media screen and (min-width: 992px) {
  .newlineControl {
    white-space: nowrap;
  }
}
</style>
