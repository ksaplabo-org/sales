<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light vh-100">
        <div class="container-fluid">
          <h1>受注情報修正</h1>
          <a class="btn-dark btn-lg" href="/public/pages/clients/list.html" role="button">受注情報一覧へ</a>
          <br />
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

          <form @submit.stop.prevent="ordersEdit" method="post">
            <div class="col-5 mx-auto center-block">
              <div class="" />

              <!-- 伝票番号 -->
              <div class="form-group d-flex flex-row">
                <label class="col">伝票番号</label>
                <p v-show="orderNo" class="col-7 pl-0">{{ orderNo }}</p>
              </div>

              <!-- 顧客番号 -->
              <div class="form-group d-flex flex-row">
                <label class="col">顧客番号</label>
                <p v-show="clientNo" class="col-7 pl-0">{{ clientNo }}</p>
              </div>

              <!-- 顧客名 -->
              <div class="form-group d-flex flex-row">
                <label class="col">顧客名</label>
                <p v-show="name" class="col-7 pl-0">{{ name }}</p>
              </div>

              <!-- 郵便番号 -->
              <div class="form-group d-flex flex-row">
                <label class="col">郵便番号</label>
                <p v-show="postCode" class="col-7 pl-0">{{ postCode }}</p>
              </div>

              <!-- 住所1 -->
              <div class="form-group d-flex flex-row">
                <label class="col">住所1</label>
                <p v-show="address1" class="col-7 pl-0">{{ address1 }}</p>
              </div>

              <!-- 住所2 -->
              <div class="form-group d-flex flex-row">
                <label class="col">住所2</label>
                <p v-show="address2" class="col-7 pl-0">{{ address2 }}</p>
              </div>

              <!-- 発注日 -->
              <div class="form-group d-flex flex-row">
                <label class="col">発注日</label>
                <input type="date" id="orderDate" class="form-control col-7" v-model="orderDate" />
              </div>
              <!-- エラーメッセージ -->
              <div class="text-danger col text-right pr-0 mb-3" v-show="orderDateErrMsg">{{ orderDateErrMsg }}</div>

              <!-- 出荷日 -->
              <div class="form-group d-flex flex-row">
                <label class="col">出荷日</label>
                <input type="date" id="shipDate" class="form-control col-7" v-model="shipDate" />
              </div>
              <!-- エラーメッセージ -->
              <div class="text-danger col text-right pr-0 mb-3" v-show="shipDateErrMsg">{{ shipDateErrMsg }}</div>

              <!-- 納品日 -->
              <div class="form-group d-flex flex-row">
                <label class="col">納品日</label>
                <input type="date" id="deliverDate" class="form-control col-7" v-model="deliverDate" />
              </div>
              <!-- エラーメッセージ -->
              <div class="text-danger col text-right pr-0 mb-3" v-show="deliverDateErrMsg">{{ deliverDateErrMsg }}</div>

              <!-- 商品コード -->
              <div class="form-group d-flex flex-row">
                <label class="col-5">商品コード</label>
                <input type="number" id="productCode" class="form-control col-4" v-model="productCode" />
                <button class="form-control col-3 btn btn-secondary ml-2">商品情報一覧</button>
              </div>
              <!-- エラーメッセージ -->
              <div class="text-danger col text-right pr-0 mb-3" v-show="productCodeErrMsg">{{ productCodeErrMsg }}</div>

              <!-- 商品名 -->
              <div class="form-group d-flex flex-row">
                <label class="col">商品名</label>
                <p v-show="productName" class="col-7 pl-0">{{ productName }}</p>
              </div>

              <!-- 数量 -->
              <div class="form-group d-flex flex-row">
                <label class="col">数量</label>
                <input type="number" id="amount" class="form-control col-7" v-model="amount" />
              </div>
              <!-- エラーメッセージ -->
              <div class="text-danger col text-right pr-0 mb-3" v-show="amountErrMsg">{{ amountErrMsg }}</div>

              <!-- 単価 -->
              <div class="form-group d-flex flex-row">
                <label class="col">単価</label>
                <p v-show="price" class="col-7 pl-0">{{ price }}</p>
              </div>

              <!-- 金額 -->
              <div class="form-group d-flex flex-row">
                <label class="col">金額</label>
                <p v-show="calcResults" class="col-7 pl-0">{{ calcResults.value }}</p>
              </div>

              <!-- 消費税額 -->
              <div class="form-group d-flex flex-row">
                <label class="col">消費税額</label>
                <p v-show="calcResults" class="col-7 pl-0">{{ calcResults.taxValue }}</p>
              </div>

              <!-- 合計金額 -->
              <div class="form-group d-flex flex-row">
                <label class="col">合計金額</label>
                <p v-show="calcResults" class="col-7 pl-0">{{ calcResults.totalValue }}</p>
              </div>
            </div>
            <!-- 修正・キャンセルボタン -->
            <div class="form-group d-flex justify-content-center col">
              <div class="col-2">
                <input class="btn btn-primary btn-lg btn-block" type="submit" value="修正" />
              </div>

              <CancelButton />
            </div>
          </form>
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
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as OrdersUtil from "@/utils/OrdersUtil";
import UserConst from "@/utils/const/UserConst";
// 共通
import Header from "../../components/Header.vue";
import "../../utils/sb-admin";
import Loading from "../../components/Loading.vue";
import CancelButton from "../../components/CancelButton.vue";
export default {
  props: ["flashMsg", "flashErrMsg"],
  components: { Header, Loading, CancelButton },
  data() {
    return {
      isLoading: false,
      isErr: false,
      //各項目初期値
      orderNo: "",
      clientNo: "",
      name: "",
      postCode: "",
      address1: "",
      address2: "",
      orderDate: "",
      shipDate: "",
      deliverDate: "",
      productCode: "",
      productName: "",
      amount: null,
      price: null,
      calcResults: "",
      updateId: "",
      updateDate: "",

      //エラーメッセージ
      errMsg: "",
      orderDateErrMsg: "",
      shipDateErrMsg: "",
      deliverDateErrMsg: "",
      productCodeErrMsg: "",
      amountErrMsg: "",
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
      this.isLoading = true;

      await this.updateView();

      this.isLoading = false;
      // // メッセージ設定
      // this.msg = this.flashMsg;
      // this.errMsg = this.flashErrMsg;
    } catch (e) {
      this.errMsg = e.message;
    }
  },
  methods: {
    /**
     * 画面更新
     */
    updateView: async function () {
      //クエリストリングを取得
      const query = this.$route.query;
      //編集対象の顧客番号を設定する
      this.orderNo = query.orderNo;

      try {
        // 伝票番号から受注情報を取得
        const response = await AjaxUtil.getOrdersByOrderNo("2025082601");
        const orderData = JSON.parse(response.data.Items);

        // 顧客情報を各項目にセット
        this.orderNo = orderData.order_no;
        this.clientNo = orderData.client_no.toString().padStart(8, "0");
        this.name = orderData.client.name;
        this.postCode = orderData.client.post_code;
        this.address1 = orderData.client.address1;
        this.address2 = orderData.client.address2;
        this.orderDate = orderData.order_date;
        this.shipDate = orderData.ship_date;
        this.deliverDate = orderData.deliver_date;
        this.productCode = orderData.product.product_code;
        this.productName = orderData.product.product_name;
        this.amount = orderData.amount;
        this.price = orderData.product.price;

        //計算処理(戻り値は連想配列)を呼び出し、計算結果の項目にセット
        this.calcResults = OrdersUtil.calcValue(this.amount, this.price);
      } catch (e) {
        this.errMsg = "顧客情報取得に失敗しました";
        console.log(e);
      }

      this.isLoading = false;
    },

    /**
     * 受注情報更新
     */
    ordersEdit: async function () {
      this.isLoading = true;

      const maxDate = new Date(9999, 12 - 1, 31); // 日付範囲の上限
      const minDate = new Date(2016, 1 - 1, 1); // 日付範囲の下限

      // メッセージ初期化
      this.errMsg = "";
      this.orderDateErrMsg = "";
      this.shipDateErrMsg = "";
      this.deliverDateErrMsg = "";
      this.productCodeErrMsg = "";
      this.amountErrMsg = "";

      // エラーが1つでもあるかどうかチェックする用
      this.isErr = false;
      console.log("これから");
      try {
        // 入力チェック
        if (this.orderDate == null || this.orderDate === "") {
          this.orderDateErrMsg = "発注日が未入力です。";
          this.isErr = true;
        }
        if (this.shipDate == null || this.shipDate === "") {
          this.shipDateErrMsg = "出荷日が未入力です。";
          this.isErr = true;
        }
        if (this.deliverDate == null || this.deliverDate === "") {
          this.deliverDateErrMsg = "納品日が未入力です。";
          this.isErr = true;
        }
        if (this.productCode == null || this.productCode === "") {
          this.productCodeErrMsg = "商品コードが未入力です。";
          this.isErr = true;
        }
        if (this.amount == null || this.amount === "") {
          this.amountErrMsg = "数量が未入力です。";
          this.isErr = true;
        }
        if (this.amount <= 0 || 100 <= this.amount) {
          this.amountErrMsg = "数量が誤っています。1以上かつ2桁以内で入力してください。";
          this.isErr = true;
        }
        if (isNaN(this.amount)) {
          this.amountErrMsg = "数量は半角数字で入力してください";
          this.isErr = true;
        }
        if (this.orderDate < minDate || maxDate < this.orderDate) {
          this.orderDateErrMsg = "発注日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          this.isErr = true;
        }
        if (this.shipDate < minDate || maxDate < this.shipDate) {
          this.shipDateErrMsg = "出荷日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          this.isErr = true;
        }
        if (this.deliverDate < minDate || maxDate < this.deliverDate) {
          this.deliverDateErrMsg = "納品日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          this.isErr = true;
        }
        // if (isNaN(new Date(this.orderDate))) {
        //   this.orderDateErrMsg = "発注日が不正です。yyyy/mm/dd形式で入力してください。";
        //   this.isErr = true;
        // }
        // if (isNaN(new Date(this.shipDate))) {
        //   this.shipDateErrMsg = "出荷日が不正です。yyyy/mm/dd形式で入力してください。";
        //   this.isErr = true;
        // }
        // if (isNaN(new Date(this.deliverDate))) {
        //   this.deliverDateErrMsg = "納品日が不正です。yyyy/mm/dd形式で入力してください。";
        //   this.isErr = true;
        // }

        // エラーが1つでもあった(true)場合、処理を終了
        if (this.isErr) {
          return;
        }

        // 引数格納
        const model = {
          orderNo: this.orderNo,
          orderDate: this.orderDate,
          shipDate: this.shipDate,
          deliverDate: this.deliverDate,
          productCode: this.productCode,
          amount: this.amount,
          //ログイン中のidを取得
          // updateId: UserUtil.currentUserInfo().id,
        };
        console.log(model);

        await AjaxUtil.putOrders(model);
        window.alert("受注情報修正処理が完了しました。");
        window.location.href = "/public/pages/clients/list.html";
      } catch (e) {
        window.alert("受注情報修正処理に失敗しました。");
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
