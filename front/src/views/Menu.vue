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
                <input type="month" v-model="yearMonth" />
              </div>
              <button type="button" class="btn btn-dark" :disabled="yearMonth == ''" v-on:click="salesSheetOutput()">
                売上一覧出力
              </button>
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
import * as AjaxUtil from "@/utils/AjaxUtil";
import { Workbook } from "exceljs";
import * as OrdersUtil from "@/utils/OrdersUtil";

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
      yearMonth: "",
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
    /*
     *売上一覧出力
     */
    async salesSheetOutput() {
      try {
        // 選択された顧客情報を取得
        const searchResult = await AjaxUtil.getOrdersByYearMonth(this.yearMonth);
        const ordersData = JSON.parse(searchResult.data.Items);

        // テンプレートのExcelファイル(public/excel配下)を取得し、読み込みができるようにバイナリ形式に変換
        const response = await fetch("/excel/salesSheetTemplate.xlsx");
        const arrayBufferTemplate = await response.arrayBuffer();

        // 新しいワークブックを作成
        const workBook = new Workbook();
        // テンプレートファイルを読み込む
        await workBook.xlsx.load(arrayBufferTemplate);
        // エクセルのシートを取得
        const sheet = workBook.getWorksheet("売上一覧");

        const table = sheet.getTable("売上一覧テーブル");

        // 取得したデータをExcelに書き込む処理
        ordersData.forEach((orderData) => {
          table.addRow([
            orderData.order_date,
            String(orderData.client.client_no).padStart(8, "0"),
            orderData.client.name,
            orderData.product.product_code,
            orderData.amount,
            orderData.product.price,
          ]);

          // const totalPriceWithoutTax = orderData.amount * orderData.product.price;
          // const calcResults = OrdersUtil.calcTax(totalPriceWithoutTax);
          // sheet.getCell("G" + (9 + index)).value = totalPriceWithoutTax;
          // sheet.getCell("H" + (9 + index)).value = calcResults.tax;
          // sheet.getCell("I" + (9 + index)).value = calcResults.pricePlusTax;

          // sheet.getCell("A" + (9 + index)).value = orderData.order_date;
          // sheet.getCell("B" + (9 + index)).value = String(orderData.client.client_no).padStart(8, "0");
          // sheet.getCell("C" + (9 + index)).value = orderData.client.name;
          // sheet.getCell("D" + (9 + index)).value = orderData.product.product_code;
          // sheet.getCell("E" + (9 + index)).value = orderData.amount;
          // sheet.getCell("F" + (9 + index)).value = orderData.product.price;
          // const totalPriceWithoutTax = orderData.amount * orderData.product.price;
          // const calcResults = OrdersUtil.calcTax(totalPriceWithoutTax);
          // sheet.getCell("G" + (9 + index)).value = totalPriceWithoutTax;
          // sheet.getCell("H" + (9 + index)).value = calcResults.tax;
          // sheet.getCell("I" + (9 + index)).value = calcResults.pricePlusTax;
        });

        // js上でのExcelデータをブラウザ上でのExcelデータに変換する処理
        // 加工したExcelファイルをバイナリデータに変換
        const buffer = await workBook.xlsx.writeBuffer();

        // バイナリデータをブラウザ上でファイルとして扱うための処理(blob化)
        const blob = new Blob([buffer], {
          // Excelファイル形式で扱うという指定
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // ダウンロード処理(js上で直接ダウンロードさせる関数がないのでパワー)
        // 仮想アンカータグを生成
        const link = document.createElement("a");
        // blobをURLへ変換
        link.href = URL.createObjectURL(blob);
        // ダウンロード時のファイル名指定
        link.download = "売上一覧.xlsx";
        // 自動クリック(無理矢理)
        link.click();
      } catch {
        this.errMsg = "Excelファイル出力に失敗しました";
      }
    },
    //受注情報一覧画面遷移
    onClickOrdersButton() {
      this.$router.push({ name: "ordersList" });
    },
    //顧客情報一覧画面遷移
    onClickClientsButton() {
      this.$router.push({ name: "clientsList" });
    },
    //商品情報一覧画面遷移
    onClickProductsButton() {
      this.$router.push({ name: "productsList" });
    },
    //ユーザー情報一覧画面遷移
    onClickUsersButton() {
      this.$router.push({ name: "usersList" });
    },
  },
};
</script>
