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
        const tmpordersData = await AjaxUtil.getOrdersByYearMonth(this.yearMonth);
        const ordersData = JSON.parse(tmporderData.data.Items);


        // テンプレートのExcelファイル(public/excel配下)を取得し、読み込みができるようにバイナリ形式に変換
        const response = await fetch("/excel/deliverNoteTemplate.xlsx");
        const arrayBufferTemplate = await response.arrayBuffer();

        // 新しいワークブックを作成
        const workBook = new Workbook();
        // テンプレートファイルを読み込む
        await workBook.xlsx.load(arrayBufferTemplate);
        // エクセルのシートを取得
        const sheet = workBook.getWorksheet("納品書");

        // // 取得したデータをExcelに書き込む処理
        // // 受注情報
        // sheet.getCell("E5").value = orderData.order_no;
        // sheet.getCell("B13").value = String(orderData.order_date).replace(/-/g, "/");
        // sheet.getCell("C13").value = String(orderData.ship_date).replace(/-/g, "/");
        // sheet.getCell("D13").value = String(orderData.deliver_date).replace(/-/g, "/");
        // // 顧客情報
        // sheet.getCell("B9").value = orderData.client.name;
        // sheet.getCell("E8").value = "〒" + orderData.client.post_code;
        // sheet.getCell("E9").value = orderData.client.address1;
        // sheet.getCell("E10").value = orderData.client.address2;
        // // 商品情報
        // sheet.getCell("B16").value = orderData.product.product_code;
        // sheet.getCell("C16").value = orderData.product.product_name;
        // sheet.getCell("D16").value = orderData.amount;
        // sheet.getCell("E16").value = orderData.product.price;
        // //計算処理(戻り値は連想配列)を呼び出し、計算結果をExcelに書き込む
        // const calcResults = OrdersUtil.calcValue(orderData.amount, orderData.product.price);
        // sheet.getCell("E17").value = calcResults.value;
        // sheet.getCell("E18").value = calcResults.taxValue;
        // sheet.getCell("E19").value = calcResults.totalValue;

        // // js上でのExcelデータをブラウザ上でのExcelデータに変換する処理
        // // 加工したExcelファイルをバイナリデータに変換
        // const buffer = await workBook.xlsx.writeBuffer();

        // // バイナリデータをブラウザ上でファイルとして扱うための処理(blob化)
        // const blob = new Blob([buffer], {
        //   // Excelファイル形式で扱うという指定
        //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // });

        // // ダウンロード処理(js上で直接ダウンロードさせる関数がないのでパワー)
        // // 仮想アンカータグを生成
        // const link = document.createElement("a");
        // // blobをURLへ変換
        // link.href = URL.createObjectURL(blob);
        // // ダウンロード時のファイル名指定
        // link.download = "納品書" + orderData.order_no + ".xlsx";
        // // 自動クリック(無理矢理)
        // link.click();
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
