<template>
  <div>
    <Header />

    <div id="content-wrapper" class="bg-light">
      <div class="container-fluid">
        <!-- タイトルとメニュー遷移ボタン -->
        <h1 class="border-bottom">顧客情報一覧</h1>
        <button class="btn btn-dark mb-4" v-on:click="onClickMenuButton()">メニュー画面へ</button>

        <!-- コンテンツStart -->
        <div style="width: 90%; margin: auto">
          <!-- インポートしたテーブル -->
          <Table :items="items" :fields="fields" :rows="rows" @sendRow="receiveRow" />

          <!-- 登録・修正・削除ボタンStart -->
          <div class="form-group d-flex justify-content-center">
            <div class="p-2 w-25">
              <button class="btn btn-primary btn-block" v-on:click="onClickCreateButton()">登録</button>
            </div>
            <div class="p-2 w-25">
              <button class="btn btn-info btn-block" v-on:click="onClickEditButton()" :disabled="clientNo == null">
                修正
              </button>
            </div>
            <div class="p-2 w-25">
              <button class="btn btn-danger btn-block" v-on:click="onClickDeleteButton()" :disabled="clientNo == null">
                削除
              </button>
            </div>
          </div>
          <!-- 登録・修正・削除ボタンEnd -->
        </div>
      </div>
      <!-- コンテンツEnd -->
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
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";
import UserConst from "@/utils/const/UserConst";
import Table from "../../components/Table.vue";

export default {
  props: ["flashMsg"],
  components: { Header, Loading, Table },
  data() {
    return {
      msg: this.flashMsg,
      errMsg: "",
      isLoading: false,
      clientNo: null,

      //テーブル定義
      items: [],
      fields: [
        { key: "client_noForDisplay", label: "顧客番号", sortable: true },
        { key: "name", label: "顧客名", sortable: false },
        { key: "post_code", label: "郵便番号", sortable: false },
        { key: "address1", label: "住所1", sortable: false },
        { key: "address2", label: "住所2", sortable: false },
        { key: "tel_no", label: "電話番号", sortable: false },
      ],
    };
  },
  async mounted() {
    try {
      this.isLoading = true;

      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });

        //権限チェック(管理者以外拒否)
      } else if (UserUtil.currentUserInfo().userRole != UserConst.UserRole.admin) {
        this.$router.push({ name: "logIn", params: { flashMsg: "権限がありません" } });
      }

      // 顧客情報取得
      await this.getClients();
      // テーブルに表示するページ数を設定
      this.rows = this.items.length;
    } catch (e) {
      this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    /*
     *顧客情報取得処理
     */
    getClients: async function () {
      this.msg = "";
      this.errMsg = "";

      try {
        const response = await AjaxUtil.getClients();
        this.items = JSON.parse(response.data.Items);
      } catch (e) {
        this.msg = "";
        this.errMsg = "顧客情報取得処理に失敗しました";
        console.log(e);
      }
    },

    /*
     *一覧のデータ選択時、一時的な値を格納する処理
     */
    receiveRow(clientRow) {
      this.clientNo = clientRow.client_no;
    },

    /*
     *メニュー画面遷移
     */
    onClickMenuButton: async function () {
      this.$router.push({ name: "menu" });
    },

    /*
     *登録画面遷移
     */
    onClickCreateButton: async function () {
      this.$router.push({ name: "clientsCreate" });
    },

    /*
     *修正画面遷移
     */
    onClickEditButton: async function () {
      this.$router.push({ name: "clientsEdit", query: { clientNo: this.clientNo } });
    },

    /*
     *削除画面遷移
     */
    onClickDeleteButton: async function () {
      this.$router.push({ name: "clientsDelete", query: { clientNo: this.clientNo } });
    },
  },
};
</script>
