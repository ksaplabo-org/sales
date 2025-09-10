<template>
  <div>
    <Header />
    <div id="content-wrapper" class="bg-light min-vh-100">
      <div class="container-fluid">
        <!-- タイトルとメニュー遷移ボタン -->
        <h1 class="border-bottom">受注情報一覧</h1>
        <button type="button" class="btn btn-dark" v-on:click="() => $router.push({ name: 'menu' })">
          メニュー画面へ
        </button>
        <button
          class="btn btn-dark"
          v-on:click="deliveryNoteOutput()"
          :disabled="orderRow == null"
          style="margin-left: 15px"
        >
          納品書出力
        </button>
        <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

        <!-- コンテンツStart -->
        <div style="width: 90%; margin: auto">
          <!-- インポートしたテーブル -->
          <Table
            :items="items"
            :fields="fields"
            empDataMsg="受注情報がありません"
            @sendRow="setReceiveRow"
            style="margin-top: 15px"
          />

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
              <button class="btn btn-danger btn-block" v-on:click="onClickDeleteButton()" :disabled="orderRow == null">
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
        { key: "order_date", label: "発注日", sortable: false },
        { key: "ship_date", label: "出荷日", sortable: false },
        { key: "deliver_date", label: "納品日", sortable: false },
      ],
    };
  },
  async mounted() {
    //ログインチェック
    if (!UserUtil.isLogIn()) {
      this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
    }
    this.isLoading = true;
    // 受注情報取得
    await this.getOrders();
    this.isLoading = false;
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
        this.items = tmpResponse.map((order) => {
          return {
            order_no: order.order_no,
            // 0埋めされた表示用の顧客番号
            display_client_no: String(order.client_no).padStart(8, "0"),
            order_date: order.order_date,
            ship_date: order.ship_date,
            deliver_date: order.deliver_date,
          };
        });
      } catch (e) {
        this.msg = "";
        this.errMsg = "受注情報取得処理に失敗しました。";
        console.log(e);
      }
    },

    /*
     *一覧のデータ選択時、一時的な値を格納する処理
     */
    setReceiveRow(orderRow) {
      this.orderRow = orderRow;
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

    deliveryNoteOutput() {},
  },
};
</script>
