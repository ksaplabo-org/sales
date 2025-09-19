<template>
  <div>
    <Header />
    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <!-- タイトルとメニュー遷移ボタン -->
          <h1 class="border-bottom">商品情報一覧</h1>
          <button class="btn btn-dark mb-4" v-on:click="onClickMenuButton()">メニュー画面へ</button>

          <!-- コンテンツStart -->
          <div style="width: 90%; margin: auto">
            <Table :items="items" :fields="fields" :empDataMsg="'商品情報がありません'" @sendRow="setReceiveRow" />
            <!-- 登録・修正・削除ボタンStart -->
            <div class="form-group d-flex justify-content-center">
              <div class="p-2 w-25">
                <button class="btn btn-primary btn-block" v-on:click="onClickCreateButton()">登録</button>
              </div>
              <div class="p-2 w-25">
                <button class="btn btn-info btn-block" v-on:click="onClickEditButton()" :disabled="productRow == null">
                  修正
                </button>
              </div>
              <div class="p-2 w-25">
                <button
                  class="btn btn-danger btn-block"
                  v-on:click="onClickDeleteButton()"
                  :disabled="productRow == null"
                >
                  削除
                </button>
              </div>
            </div>
            <!-- 登録・修正・削除ボタンEnd -->
          </div>
        </div>
        <!-- コンテンツEnd -->
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
// 共通コンポーネント関係
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
import Table from "../../components/Table.vue";

// util関係
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";

export default {
  props: ["flashMsg"],
  components: { Header, Loading, Table },
  data() {
    return {
      msg: this.flashMsg,
      errMsg: "",
      isLoading: false,
      productRow: null,

      //テーブル定義
      items: [],
      fields: [
        { key: "product_code", label: "商品コード", sortable: true },
        { key: "product_name", label: "商品名", sortable: false },
        { key: "price", label: "単価", sortable: false },
      ],
    };
  },
  async mounted() {
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });
      }
      // 商品情報取得処理を呼び出す
      await this.getProducts();
    } catch (e) {
      this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });
    }
  },
  methods: {
    /*
     *商品情報取得処理
     */
    async getProducts() {
      this.isLoading = true;

      this.msg = "";
      this.errMsg = "";

      try {
        const response = await AjaxUtil.getProducts();
        this.items = JSON.parse(response.data.Items);
      } catch (e) {
        this.msg = "";
        this.errMsg = "商品情報取得処理に失敗しました。";
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },

    /*
     *一覧選択行の情報を保持する
     */
    setReceiveRow(productRow) {
      this.productRow = productRow;
    },

    /*
     *メニュー画面遷移
     */
    onClickMenuButton() {
      this.$router.push({ name: "menu" });
    },

    /*
     *登録画面遷移
     */
    onClickCreateButton() {
      this.$router.push({ name: "productsCreate" });
    },

    /*
     *修正画面遷移
     */
    onClickEditButton() {
      this.$router.push({ name: "productsEdit", query: { productCode: this.productRow.product_code } });
    },

    /*
     *削除画面遷移
     */
    onClickDeleteButton() {
      this.$router.push({ name: "productsDelete", query: { productCode: this.productRow.product_code } });
    },
  },
};
</script>
