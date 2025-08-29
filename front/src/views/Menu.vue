<template>
  <div>
    <Header />

    <div id="content-wrapper" class="bg-light">
      <div>
        <h1>メニュー</h1>
      </div>
      <div class="container-fluid">
        <p class="text-dark" v-show="errMsg">{{ errMsg }}</p>
        <div class="d-flex flex-row">
          <div class="col-1"></div>
          <div class="col-3">
            <div class="card shadow mb-4">
              <div class="card-header py-3">
                <div class="m-0 font-weight-bold text-primary text-secondary">受注情報</div>
              </div>
              <div class="card-body">
                <div class="text">受注情報の閲覧、登録、修正、削除が可能です。</div>
                <button type="button" class="btn btn-dark" v-on:click="onClickOrdersButton()">
                  受注情報一覧画面へ
                </button>
              </div>
            </div>
          </div>
          <div class="col-3">
            <div v-if="this.role == 2">
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <div class="m-0 font-weight-bold text-primary text-secondary">売上一覧</div>
                </div>
                <div class="card-body">
                  <div class="text">日付入力後、売上一覧の出力が可能です。</div>
                  <div class="text">
                    日付：
                    <input type="month" />
                  </div>
                  <button type="button" class="btn btn-dark">売上一覧出力</button>
                </div>
              </div>
            </div>
            <div v-if="this.role == 1">
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <div class="m-0 font-weight-bold text-primary text-secondary">顧客情報</div>
                </div>
                <div class="card-body">
                  <div class="text">顧客情報の閲覧、登録、修正、削除が可能です。</div>
                  <button type="button" class="btn btn-dark" v-on:click="onClickClientsButton()">
                    顧客情報一覧画面へ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-row">
          <div class="col-1"></div>
          <div class="col-3">
            <div v-if="this.role == 1">
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <div class="m-0 font-weight-bold text-primary text-secondary">商品情報</div>
                </div>
                <div class="card-body">
                  <div class="text">商品情報の閲覧、登録、修正、削除が可能です。</div>
                  <button type="button" class="btn btn-dark" v-on:click="onClickProductsButton()">
                    商品情報一覧画面へ
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3">
            <div v-if="this.role == 1">
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <div class="m-0 font-weight-bold text-primary text-secondary">ユーザー情報</div>
                </div>
                <div class="card-body">
                  <div class="text">ユーザー情報の閲覧、登録、修正、削除が可能です。</div>
                  <button type="button" class="btn btn-dark" v-on:click="onClickUsersButton()">
                    ユーザー情報一覧画面へ
                  </button>
                </div>
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
    };
  },
  async mounted() {
    try {
      if (UserUtil.isLogIn()) {
        this.msg = "";
        this.errMsg = "";
        this.role = UserUtil.roleCheck();
      } else {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });
      }
    } catch (e) {
      this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });
    }
  },
  methods: {
    //受注情報一覧画面遷移
    onClickOrdersButton: async function () {
      this.$router.push({ name: "ordersList" });
    },
    //顧客情報一覧画面遷移
    onClickClientsButton: async function () {
      this.$router.push({ name: "clientsList" });
    },
    //商品情報一覧画面遷移
    onClickProductsButton: async function () {
      this.$router.push({ name: "productsList" });
    },
    //ユーザー情報一覧画面遷移
    onClickUsersButton: async function () {
      this.$router.push({ name: "usersList" });
    },
  },
};
</script>
