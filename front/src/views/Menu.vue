<template>
  <div>
    <Header />
    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">メニュー</h1>
        </div>
        <p class="text-danger mb-4" v-show="errMsg">{{ errMsg }}</p>

        <div class="row row-cols-auto justify-content-center" style="margin: 15px auto">
          <div class="col-lg-4 mb-4">
            <div class="card shadow mb-4">
              <div class="card-header py-3">
                <div class="m-0 font-weight-bold text-primary text-secondary">受注情報</div>
              </div>
              <div class="card-body">
                <div class="text" style="margin-bottom: 10px">受注情報の閲覧、登録、修正、削除が可能です。</div>
                <button type="button" class="btn btn-dark" v-on:click="onClickOrdersButton()">
                  受注情報一覧画面へ
                </button>
              </div>
            </div>
          </div>

          <div class="col-lg-4 mb-4" v-if="this.role == this.post">
            <div class="card shadow mb-4">
              <div class="card-header py-3">
                <div class="m-0 font-weight-bold text-primary text-secondary">売上一覧</div>
              </div>
              <div class="card-body">
                <div class="text" style="margin-bottom: 10px">出力年月入力後、売上一覧の出力が可能です。</div>
                <div class="form-inline">
                  <label for="inputOutputYM">出力年月：</label>
                  <input class="form-control col-7 ml-2" id="inputOutputYM" type="month" v-model="outputYM" />
                </div>
                <div class="text-danger" v-show="outputYMErrMsg">
                  {{ outputYMErrMsg }}
                </div>
                <button
                  type="button"
                  class="btn btn-dark"
                  style="margin-top: 10px"
                  :disabled="outputYM == ''"
                  v-on:click="salesSheetOutput()"
                >
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
                <button type="button" class="btn btn-dark" v-on:click="onClickClientsButton()">
                  顧客情報一覧画面へ
                </button>
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
// exceljsをインポート
import { Workbook } from "exceljs";

// コンポーネント関連
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";

// util関連
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as OrdersUtil from "@/utils/OrdersUtil";
import * as UserUtil from "@/utils/UserUtil";
import UserConst from "@/utils/const/UserConst";
export default {
  components: { Header, Loading },
  data() {
    return {
      // ローディング設定
      isLoading: false,

      // 項目
      role: "",
      admin: UserConst.UserRole.admin,
      post: UserConst.UserRole.post,
      outputYM: "",

      // エラーメッセージ
      errMsg: "",
      outputYMErrMsg: "",
    };
  },
  mounted() {
    if (UserUtil.isLogIn()) {
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
        this.isLoading = true;

        const maxDate = new Date("9999-12-31"); // 日付範囲の上限(9999/12/31)
        const minDate = new Date("2016-01-01"); // 日付範囲の下限(2016/01/01)

        // Date同士での比較ができるように、string型で入力されたものをDate型へ変換
        const outputYM = new Date(this.outputYM);

        // 出力年月の入力チェック
        if (this.outputYM == null || this.outputYM === "") {
          this.outputYMErrMsg = "出力年月が未入力です。";
          return;
        } else if (isNaN(outputYM.getDate())) {
          this.outputYMErrMsg = "出力年月が不正です。yyyy/mm形式で入力してください。";
          return;
        } else if (outputYM < minDate || maxDate < outputYM) {
          this.outputYMErrMsg = "出力年月が不正です。2016/01/01～9999/12/31の間で指定してください。";
          return;
        }
        // 入力された年月範囲内の受注情報を全件取得する
        const searchResult = await AjaxUtil.findByOrderDateYM(this.outputYM);
        const ordersData = JSON.parse(searchResult.data.Items);

        // 現在の時刻を取得し、フォーマットを変更
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0"); // 月は0始まりなので+1
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const timestampForDisplay = `${yyyy}/${mm}/${dd}  ${hh}:${min}:${ss}`;

        // 入力された年月のフォーマットを変更
        const [year, month] = this.outputYM.split("-");
        const outputYMForDisplay = `${year}年${month}月`;

        // テンプレートのExcelファイル(public/excel配下)を取得し、読み込みができるようにバイナリ形式に変換
        const response = await fetch("/excel/salesSheetTemplate.xlsx");
        const arrayBufferTemplate = await response.arrayBuffer();

        // 新しいワークブックを作成し、テンプレートのExcelファイルとそのファイル内のシートを読み込む
        const workBook = new Workbook();
        await workBook.xlsx.load(arrayBufferTemplate);
        const sheet = workBook.getWorksheet("売上一覧");

        // テーブルを作成するかどうかの分岐
        if (ordersData.length == 0) {
          const confirmResult = window.confirm("該当期間の売上が存在しませんがExcelファイルを出力しますか？");
          if (!confirmResult) {
            return;
          }
          sheet.getCell("A8").value = "該当期間のデータが存在しません";
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
          // 合計売上金額をセルに代入
          sheet.getCell("K6").value = totalPricePlusTax;
        }
        // 各セルに値を代入
        sheet.getCell("B6").value = outputYMForDisplay;
        sheet.getCell("K1").value = timestampForDisplay;

        // 編集したExcelファイルをバイナリデータに変換し、ブラウザ上でファイルとして扱えるようにblob化
        const buffer = await workBook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          // Excelファイル形式で扱うという指定
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // 仮想アンカータグを作成し、作成したExcelファイルを設定し、js内でクリックしダウンロード
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${outputYMForDisplay}売上一覧.xlsx`;
        link.click();
      } catch {
        this.errMsg = "Excelファイル出力処理に失敗しました";
      } finally {
        this.isLoading = false;
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
