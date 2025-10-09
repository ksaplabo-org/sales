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
        // 現在の時刻を取得し、フォーマットを変更
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0"); // 月は0始まりなので+1
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const nowForOutPut = `${yyyy}/${mm}/${dd}  ${hh}:${min}:${ss}`;
        
        // 入力された年月のフォーマットを変更
        const [year, month] = this.yearMonth.split("-");
        const yearMonthForOutPut = `${year}年${month}月`;

        // テンプレートのExcelファイル(public/excel配下)を取得し、読み込みができるようにバイナリ形式に変換
        const response = await fetch("/excel/salesSheetTemplate.xlsx");
        const arrayBufferTemplate = await response.arrayBuffer();

        // 新しいワークブックを作成し、テンプレートのExcelファイルとそのファイル内のシートを読み込む
        const workBook = new Workbook();
        await workBook.xlsx.load(arrayBufferTemplate);
        const sheet = workBook.getWorksheet("売上一覧");

        // 入力された年月範囲内の受注情報を全件取得する
        const searchResult = await AjaxUtil.getOrdersByYearMonth(this.yearMonth);
        const ordersData = JSON.parse(searchResult.data.Items);

        // テーブルを作成するかどうかの分岐
        if (ordersData.length == 0) {
          const confirmResult = window.confirm("該当期間の売上が存在しませんがExcelファイルを出力しますか？");
          if (confirmResult) {
            sheet.getCell("A8").value = "該当期間のデータが存在しません";
            sheet.getCell("B6").value = yearMonthForOutPut;
            sheet.getCell("K1").value = nowForOutPut;
          } else {
            return;
          }
        } else {
          // 合計売上金額計算用
          let totalPricePlusTax = 0;

          // 売上一覧テーブルを作成し、取得した値を代入する。
          sheet.addTable({
            name: "売上一覧テーブル",
            ref: "A8",
            headerRow: true,
            style: {
              theme: "TableStyleMedium13",
              showRowStripes: true,
            },
            columns: [
              { name: "発注日" },
              { name: "伝票番号" },
              { name: "顧客番号" },
              { name: "顧客名" },
              { name: "商品コード" },
              { name: "商品名" },
              { name: "数量" },
              { name: "単価" },
              { name: "金額" },
              { name: "消費税額" },
              { name: "合計金額" },
            ],
            rows: ordersData.map((order) => {
              const totalPriceWithoutTax = order.amount * order.product.price;
              const calcResults = OrdersUtil.calcTax(totalPriceWithoutTax);
              totalPricePlusTax += calcResults.pricePlusTax;
              return [
                order.order_date.replace(/-/g, "/"),
                order.order_no,
                String(order.client.client_no).padStart(8, "0"),
                order.client.name,
                order.product.product_code,
                order.product.product_name,
                order.amount,
                order.product.price,
                totalPriceWithoutTax,
                calcResults.tax,
                calcResults.pricePlusTax,
              ];
            }),
          });
          // 各セルに値を代入
          sheet.getCell("B6").value = yearMonthForOutPut;
          sheet.getCell("K1").value = nowForOutPut;
          sheet.getCell("K6").value = totalPricePlusTax;
        }

        // 以下ファイル出力処理

        // 加工したExcelファイルをバイナリデータに変換する。
        const buffer = await workBook.xlsx.writeBuffer();
        // ブラウザ上でファイルとして扱うための処理(blob化)
        const blob = new Blob([buffer], {
          // Excelファイル形式で扱うという指定
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // ダウンロード処理
        // 仮想アンカータグを作成し、作成したExcelファイルを設定し、js内でクリックする。
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${yearMonthForOutPut}売上一覧.xlsx`;
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
