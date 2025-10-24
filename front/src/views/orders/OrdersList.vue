<template>
  <div>
    <Header />
    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <!-- タイトルとメニュー遷移ボタン -->
          <h1 class="border-bottom">受注情報一覧</h1>
          <button class="btn btn-dark" v-on:click="onClickMenuButton()">メニュー画面へ</button>
          <button
            class="btn btn-secondary"
            v-on:click="deliveryNoteOutput()"
            :disabled="selectedRow == null"
            style="margin-left: 15px"
          >
            納品書出力
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <!-- コンテンツStart -->
          <div class="mt-4" style="width: 90%; margin: auto">
            <Table :items="items" :fields="fields" :empDataMsg="'受注情報がありません'" @sendRow="setSelectedRow" />
            <!-- 登録・修正・削除ボタンStart -->
            <div class="form-group d-flex justify-content-center">
              <div class="p-2 w-25">
                <button class="btn btn-primary btn-block" v-on:click="onClickCreateButton()">登録</button>
              </div>
              <div class="p-2 w-25">
                <button class="btn btn-info btn-block" v-on:click="onClickEditButton()" :disabled="selectedRow == null">
                  修正
                </button>
              </div>
              <div class="p-2 w-25">
                <button
                  class="btn btn-danger btn-block"
                  v-on:click="onClickDeleteButton()"
                  :disabled="selectedRow == null"
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
import Table from "@/components/Table.vue";

// exceljsインポート
import { Workbook } from "exceljs";

// util関連
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as OrdersUtil from "@/utils/OrdersUtil";
import * as UserUtil from "@/utils/UserUtil";
import UserConst from "@/utils/const/UserConst";

export default {
  components: { Header, Loading, Table },
  data() {
    return {
      errMsg: "",
      isLoading: false,
      selectedRow: null,

      //テーブル定義
      items: [],
      fields: [
        { key: "order_no", label: "伝票番号", sortable: true },
        { key: "client_no", label: "顧客番号", sortable: false },
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
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });

        //権限チェック(管理者以外拒否)
      } else if (UserUtil.currentUserInfo().userRole != UserConst.UserRole.admin) {
        this.$router.push({ name: "logIn", params: { flashMsg: "権限がありません。" } });
      }

      // 受注情報取得
      await this.getOrders();
      // テーブルに表示するページ数を設定
      this.rows = this.items.length;
    } catch (e) {
      this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
    }
  },
  methods: {
    /*
     *受注情報取得処理
     */
    async getOrders() {
      this.isLoading = true;

      this.errMsg = "";

      try {
        const response = await AjaxUtil.getOrders();
        const tmpResponse = JSON.parse(response.data.Items);
        this.items = tmpResponse.map((order) => {
          return {
            order_no: order.order_no,
            // 0埋めされた表示用の顧客番号
            client_no: String(order.client_no).padStart(8, "0"),
            product_code: order.product_code,
            order_date: String(order.order_date).replace(/-/g, "/"),
            ship_date: String(order.ship_date).replace(/-/g, "/"),
            deliver_date: String(order.deliver_date).replace(/-/g, "/"),
          };
        });
      } catch (e) {
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
      try {
        this.isLoading = true;
        // 選択された受注情報を取得
        const searchResult = await AjaxUtil.getOrdersByOrderNo(this.selectedRow.order_no);
        const orderData = JSON.parse(searchResult.data.Items);

        // テンプレートのExcelファイル(public/excel配下)を取得し、読み込みができるようにバイナリ形式に変換
        const response = await fetch("/excel/deliveryNoteTemplate.xlsx");
        const arrayBufferTemplate = await response.arrayBuffer();

        // 新しいワークブックを作成し、テンプレートのExcelファイルとそのファイル内のシートを読み込む
        const workBook = new Workbook();
        await workBook.xlsx.load(arrayBufferTemplate);
        const sheet = workBook.getWorksheet("納品書");

        // 取得したデータをExcelに書き込む処理
        // 受注情報
        sheet.getCell("E5").value = orderData.order_no;
        sheet.getCell("B13").value = String(orderData.order_date).replace(/-/g, "/");
        sheet.getCell("C13").value = String(orderData.ship_date).replace(/-/g, "/");
        sheet.getCell("D13").value = String(orderData.deliver_date).replace(/-/g, "/");
        sheet.getCell("D16").value = orderData.amount;
        // 顧客情報
        sheet.getCell("B9").value = orderData.client.name;
        sheet.getCell("E8").value = "〒" + orderData.client.post_code;
        sheet.getCell("E9").value = orderData.client.address1;
        sheet.getCell("E10").value = orderData.client.address2;
        // 商品情報
        sheet.getCell("B16").value = orderData.product.product_code;
        sheet.getCell("C16").value = orderData.product.product_name;
        sheet.getCell("E16").value = orderData.product.price;
        //計算処理(戻り値は連想配列)を呼び出し、計算結果をExcelに書き込む
        const totalPriceWithoutTax = orderData.product.price * orderData.amount;
        const calcResults = OrdersUtil.calcTax(totalPriceWithoutTax);
        sheet.getCell("E17").value = totalPriceWithoutTax;
        sheet.getCell("E18").value = calcResults.tax;
        sheet.getCell("E19").value = calcResults.pricePlusTax;

        // 加工したExcelファイルをブラウザで扱えるよう、バイナリデータに変換後、blob化
        const buffer = await workBook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          // Excelファイル形式で扱うという指定
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // ダウンロード処理
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "納品書" + orderData.order_no + ".xlsx";
        link.click();
      } catch {
        this.errMsg = "Excelファイル出力処理に失敗しました。";
      } finally {
        this.isLoading = false;
      }
    },

    /*
     *一覧選択行の情報を保持する
     */
    setSelectedRow(selectedRow) {
      this.selectedRow = selectedRow;
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
      this.$router.push({ name: "ordersEdit", query: { orderNo: this.selectedRow.order_no } });
    },

    /*
     *削除画面遷移
     */
    onClickDeleteButton() {
      this.$router.push({ name: "ordersDelete", query: { orderNo: this.selectedRow.order_no } });
    },
  },
};
</script>
