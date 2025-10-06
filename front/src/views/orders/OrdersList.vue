<template>
  <div>
    <Header />

    <div id="content-wrapper" class="bg-light min-vh-100">
      <div class="container-fluid">
        <!-- タイトルとメニュー遷移ボタン -->
        <h1 class="border-bottom">受注情報一覧</h1>
        <button class="btn btn-dark mb-4" v-on:click="onClickMenuButton()">メニュー画面へ</button>
        <button class="btn btn-secondary ml-3 mb-4" :disabled="orderRow == null" v-on:click="deliveryNoteOutput()">
          納品書出力
        </button>

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
              <button class="btn btn-danger btn-block" v-on:click="onClickDeleteButton()" :disabled="orderRow == null">
                削除
              </button>
            </div>
          </div>
          <!-- 登録・修正・削除ボタンEnd -->
          <div id="targetArea"></div>
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
import * as OrdersUtil from "@/utils/OrdersUtil";
import { Workbook } from "exceljs";
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
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });

        //権限チェック(管理者以外拒否)
      } else if (UserUtil.currentUserInfo().userRole != UserConst.UserRole.admin) {
        this.$router.push({ name: "logIn", params: { flashMsg: "権限がありません" } });
      }

      // 受注情報取得
      await this.getOrders();
      // テーブルに表示するページ数を設定
      this.rows = this.items.length;
    } catch (e) {
      this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });
    }
  },
  methods: {
    /*
     *受注情報取得処理
     */
    async getOrders() {
      this.isLoading = true;

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
      } finally {
        this.isLoading = false;
      }
    },

    /*
     *納品書出力処理
     */
    async deliveryNoteOutput() {
      // try {
      //   // 選択された顧客情報を取得
      //   const tmporderData = await AjaxUtil.getOrdersByOrderNo(this.orderRow.order_no);
      //   const orderData = JSON.parse(tmporderData.data.Items);

      //   // テンプレートのExcelファイル(public/excel配下)を取得し、読み込みができるようにバイナリ形式に変換
      //   const response = await fetch("/excel/deliverNoteTemplate.xlsx");
      //   const arrayBufferTemplate = await response.arrayBuffer();

      //   // 新しいワークブックを作成
      //   const workBook = new Workbook();
      //   // テンプレートファイルを読み込む
      //   await workBook.xlsx.load(arrayBufferTemplate);
      //   // エクセルのシートを取得
      //   const sheet = workBook.getWorksheet("納品書");

      //   // 取得したデータをExcelに書き込む処理
      //   // 受注情報
      //   sheet.getCell("E5").value = orderData.order_no;
      //   sheet.getCell("B13").value = String(orderData.order_date).replace(/-/g, "/");
      //   sheet.getCell("C13").value = String(orderData.ship_date).replace(/-/g, "/");
      //   sheet.getCell("D13").value = String(orderData.deliver_date).replace(/-/g, "/");
      //   // 顧客情報
      //   sheet.getCell("B9").value = orderData.client.name;
      //   sheet.getCell("E8").value = "〒" + orderData.client.post_code;
      //   sheet.getCell("E9").value = orderData.client.address1;
      //   sheet.getCell("E10").value = orderData.client.address2;
      //   // 商品情報
      //   sheet.getCell("B16").value = orderData.product.product_code;
      //   sheet.getCell("C16").value = orderData.product.product_name;
      //   sheet.getCell("D16").value = orderData.amount;
      //   sheet.getCell("E16").value = orderData.product.price;
      //   //計算処理(戻り値は連想配列)を呼び出し、計算結果をExcelに書き込む
      //   const calcResults = OrdersUtil.calcValue(orderData.amount, orderData.product.price);
      //   sheet.getCell("E17").value = calcResults.value;
      //   sheet.getCell("E18").value = calcResults.taxValue;
      //   sheet.getCell("E19").value = calcResults.totalValue;
        
      //   // js上でのExcelデータをブラウザ上でのExcelデータに変換する処理
      //   // 加工したExcelファイルをバイナリデータに変換
      //   const buffer = await workBook.xlsx.writeBuffer();

      //   // バイナリデータをブラウザ上でファイルとして扱うための処理(blob化)
      //   const blob = new Blob([buffer], {
      //     // Excelファイル形式で扱うという指定
      //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      //   });

      //   // ダウンロード処理(js上で直接ダウンロードさせる関数がないのでパワー)
      //   // 仮想アンカータグを生成
      //   const link = document.createElement("a");
      //   // blobをURLへ変換
      //   link.href = URL.createObjectURL(blob);
      //   // ダウンロード時のファイル名指定
      //   link.download = "納品書" + orderData.order_no + ".xlsx";
      //   // 自動クリック(無理矢理)
      //   link.click();
      // } catch {
      //   this.errMsg = "Excelファイル出力に失敗しました。";
      // }
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
