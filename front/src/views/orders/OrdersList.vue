<template>
  <div>
    <Header />
    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <!-- タイトルとメニュー遷移ボタン -->
          <h1 class="border-bottom">受注情報一覧</h1>
          <button class="btn btn-dark mb-4" v-on:click="onClickMenuButton()">メニュー画面へ</button>

          <!-- コンテンツStart -->
          <div style="width: 90%; margin: auto">
            <Table :items="items" :fields="fields" :empDataMsg="'受注情報がありません'" @sendRow="setReceiveRow" />
            <!-- 登録・修正・削除ボタンStart -->
            <div class="form-group d-flex justify-content-center">
              <div class="p-2 w-25">
                <button class="btn btn-primary btn-block" v-on:click="onClickCreateButton()">登録</button>
              </div>
              <div class="p-2 w-25">
                <button class="btn btn-info btn-block" v-on:click="onClickEditButton()" :disabled="orderRow == null">
                  修正
                </button>
              </div>
              <div class="p-2 w-25">
                <button
                  class="btn btn-danger btn-block"
                  v-on:click="onClickDeleteButton()"
                  :disabled="orderRow == null"
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
// 共通
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";
import Table from "../../components/Table.vue";

export default {
  props: ["flashMsg"],
  components: { Header, Loading, Table },
  data() {
    return {
      msg: this.flashMsg,
      errMsg: "",
      isLoading: false,
      orderRow: null,

      //テーブル定義
      items: [],
      fields: [
        { key: "order_no", label: "伝票番号", sortable: true },
        { key: "display_client_no", label: "顧客番号", sortable: false },
        { key: "product_code", label: "商品コード", sortable: false },
        { key: "order_date", label: "発注日", sortable: false },
        { key: "ship_date", label: "出荷日", sortable: false },
        { key: "deliver_date", label: "納品日", sortable: false },
      ],
    };
  },
  async mounted() {
    try {
      //ログインチェック
      if (UserUtil.isLogIn()) {
        this.isLoading = true;

        // 受注情報取得
        await this.getOrders();
        // テーブルに表示するページ数を設定
        this.rows = this.items.length;

        this.isLoading = false;
      } else {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });
      }
    } catch (e) {
      this.errMsg = e.message;
    }
  },
  methods: {
    /*
     *受注情報取得処理
     */
    async getOrders() {
      this.msg = "";
      this.errMsg = "";

      try {
        const response = await AjaxUtil.getOrders();
        const tmpResponse = JSON.parse(response.data.Items);
        // 配列に入っている値を一つずつ取り出し、新しい変数を追加していく処理
        this.items = tmpResponse.map((order) => {
          return {
            order_no: order.order_no,
            client_no: order.client_no,
            product_code: order.product_code,
            // 0埋めされた表示用の顧客番号
            display_client_no: String(order.client_no).padStart(8, "0"),
            order_date: String(order.order_date).replace(/-/g, "/"),
            ship_date: String(order.ship_date).replace(/-/g, "/"),
            deliver_date: String(order.deliver_date).replace(/-/g, "/"),
          };
        });
      } catch (e) {
        this.msg = "";
        this.errMsg = "受注情報取得処理に失敗しました。";
        console.log(e);
      }
    },

    /*
     *一覧選択行の情報を保持する
     */
    setReceiveRow(orderRow) {
      this.orderRow = orderRow;
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
      this.$router.push({ name: "ordersCreate" });
    },

    /*
     *修正画面遷移
     */
    onClickEditButton() {
      this.$router.push({ name: "ordersEdit", query: { orderNo: this.orderRow.order_no } });
    },

    /*
     *削除画面遷移
     */
    onClickDeleteButton() {
      this.$router.push({ name: "ordersDelete", query: { orderNo: this.orderRow.order_no } });
    },
  },
};
</script>
