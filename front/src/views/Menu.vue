<template>
  <div>
    <Header />

    <div id="content-wrapper" class="bg-light min-vh-100">
      <div>
        <h1>メニュー</h1>
      </div>
      <p class="text-dark" v-show="errMsg">{{ errMsg }}</p>

      <div class="row row-cols-auto justify-content-center" style="margin: 15px auto">
        <div class="col-lg-4 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <div class="m-0 font-weight-bold text-primary text-secondary">受注情報</div>
            </div>
            <div class="card-body">
              <div class="text" style="margin-bottom: 10px">受注情報の閲覧、登録、修正、削除が可能です。</div>
              <button type="button" class="btn btn-dark" v-on:click="onClickOrdersButton()">受注情報一覧画面へ</button>
            </div>
          </div>
        </div>

        <div class="col-lg-4 mb-4" v-if="this.role == this.post">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <div class="m-0 font-weight-bold text-primary text-secondary">売上一覧</div>
            </div>
            <div class="card-body">
              <div class="text" style="margin-bottom: 10px">日付入力後、売上一覧の出力が可能です。</div>
              <div class="text" style="margin-bottom: 10px">
                日付：
                <input type="month" />
              </div>
              <button type="button" class="btn btn-dark">売上一覧出力</button>
            </div>
          </div>
        </div>

        <div class="col-lg-4 mb-4" v-if="this.role == this.admin">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <div class="m-0 font-weight-bold text-primary text-secondary">顧客情報</div>
            </div>
            <div class="card-body">
              <div class="text" style="margin-bottom: 10px">顧客情報の閲覧、登録、修正、削除が可能です。</div>
              <button type="button" class="btn btn-dark" v-on:click="onClickClientsButton()">顧客情報一覧画面へ</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="this.role == this.admin">
        <div class="row row-cols-auto justify-content-center" style="margin: 15px auto">
          <div class="col-lg-4 mb-4">
            <div class="card shadow mb-4">
              <div class="card-header py-3">
                <div class="m-0 font-weight-bold text-primary text-secondary">商品情報</div>
              </div>
              <div class="card-body">
                <div class="text" style="margin-bottom: 10px">商品情報の閲覧、登録、修正、削除が可能です。</div>
                <button type="button" class="btn btn-dark" v-on:click="onClickProductsButton()">
                  商品情報一覧画面へ
                </button>
              </div>
            </div>
          </div>

          <div class="col-lg-4 mb-4">
            <div class="card shadow mb-4">
              <div class="card-header py-3">
                <div class="m-0 font-weight-bold text-primary text-secondary">ユーザー情報</div>
              </div>
              <div class="card-body">
                <div class="text" style="margin-bottom: 10px">ユーザー情報の閲覧、登録、修正、削除が可能です。</div>
                <button type="button" class="btn btn-dark" v-on:click="onClickUsersButton()">
                  ユーザー情報一覧画面へ
                </button>
              </div>
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
import * as UserUtil from "@/utils/UserUtil";
import UserConst from "@/utils/const/UserConst";

// 共通
import Header from "../components/Header.vue";
import Loading from "../components/Loading.vue";
export default {
  props: ["flashMsg"],
  components: { Header, Loading },
  data() {
    return {
      msg: this.flashMsg,
      errMsg: "",
      isLoading: false,
      role: "",
      admin: UserConst.UserRole.admin,
      post: UserConst.UserRole.post,
    };
  },
  async mounted() {
    if (UserUtil.isLogIn()) {
      this.msg = "";
      this.errMsg = "";
      this.role = UserUtil.currentUserInfo().userRole;
    } else {
      this.$router.push({
        name: "logIn",
        params: { flashMsg: "ログインしてください。" },
      });
    }
  },
  methods: {
    //受注情報一覧画面遷移
    onClickOrdersButton: function () {
      this.$router.push({ name: "ordersList" });
    },
    //顧客情報一覧画面遷移
    onClickClientsButton: function () {
      this.$router.push({ name: "clientsList" });
    },
    //商品情報一覧画面遷移
    onClickProductsButton: function () {
      this.$router.push({ name: "productsList" });
    },
    //ユーザー情報一覧画面遷移
    onClickUsersButton: function () {
      this.$router.push({ name: "usersList" });
    },
  },
};
</script>
