<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light vh-100">
        <div class="container-fluid">
          <h1>受注情報登録</h1>
          <a class="btn-dark btn-lg" href="/public/pages/orders/list.html" role="button">受注情報一覧画面へ</a>
          <br />
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

          <form @submit.stop.prevent="ordersCreate" method="post" autocomplete="new-password">
            <div class="col-5 mx-auto center-block">
              <div class="form-group d-flex flex-row">
                <label class="col">伝票番号</label>
                <p class="col-7 h5 pl-0">自動で登録されます</p>
              </div>
              <!-- 顧客番号 -->
              <div class="form-group d-flex flex-row">
                <label class="col">顧客番号<label class="text-danger">*</label></label>
                <input
                  type="search"
                  id="clientNo"
                  class="form-control col-7"
                  placeholder="8桁以内で入力してください"
                  v-model="clientNo"
                  autocomplete="off"
                  maxlength="8"
                  minlength="1"
                  @change="inputClientNo()"
                />
              </div>
              <div class="text-danger col text-right pr-0 mb-3" v-show="clientNoMsg">{{ clientNoMsg }}</div>
              <!-- 顧客名 -->
              <div class="form-group d-flex flex-row">
                <label class="col">顧客名</label>
                <p class="col-7 h5 pl-0">{{ name }}</p>
              </div>
              <!-- 郵便番号 -->
              <div class="form-group d-flex flex-row">
                <label class="col">郵便番号</label>
                <p class="col-7 h5 pl-0">{{ postCode }}</p>
              </div>
              <!-- 住所１ -->
              <div class="form-group d-flex flex-row">
                <label class="col">住所１</label>
                <p class="col-7 h5 pl-0">{{ address1 }}</p>
              </div>

              <!-- 住所２ -->
              <div class="form-group d-flex flex-row">
                <label class="col">住所２</label>
                <p class="col-7 h5 pl-0">{{ address2 }}</p>
              </div>

              <!-- 発注日 -->
              <div class="form-group d-flex flex-row">
                <label class="col">発注日<label class="text-danger">*</label></label>
                <input type="date" id="orderDate" class="form-control col-7" v-model="orderDate" />
              </div>
              <div class="text-danger col text-right pr-0 mb-3" v-show="orderDateMsg">{{ orderDateMsg }}</div>

              <!-- 出荷日 -->
              <div class="form-group d-flex flex-row">
                <label class="col">出荷日<label class="text-danger">*</label></label>
                <input type="date" id="shipDate" class="form-control col-7" v-model="shipDate" />
              </div>
              <div class="text-danger col text-right pr-0 mb-3" v-show="shipDateMsg">{{ shipDateMsg }}</div>

              <!-- 納品日 -->
              <div class="form-group d-flex flex-row">
                <label class="col">納品日<label class="text-danger">*</label></label>
                <input type="date" id="deliverDate" class="form-control col-7" v-model="deliverDate" />
              </div>
              <div class="text-danger col text-right pr-0 mb-3" v-show="deliverDateMsg">{{ deliverDateMsg }}</div>

              <!-- 商品コード -->
              <div class="form-group d-flex flex-row">
                <label class="col">商品コード<label class="text-danger">*</label></label>
                <input
                  type="number"
                  id="productCode"
                  class="form-control col-7"
                  placeholder="7桁以内入力してください"
                  v-model="productCode"
                  max="9999999"
                  min="1000001"
                  @change="inputProductCode()"
                />
              </div>
              <div class="text-danger col text-right pr-0 mb-3" v-show="productCodeMsg">{{ productCodeMsg }}</div>

              <!-- 商品名 -->
              <div class="form-group d-flex flex-row">
                <label class="col">商品名</label>
                <p class="col-7 h5 pl-0">{{ productName }}</p>
              </div>

              <!-- 数量 -->
              <div class="form-group d-flex flex-row">
                <label class="col">数量<label class="text-danger">*</label></label>
                <input
                  type="number"
                  id="amount"
                  class="form-control col-7"
                  placeholder="2桁以内で入力してください"
                  v-model="amount"
                  max="99"
                  @change="displayValue()"
                />
              </div>
              <div class="text-danger col text-right pr-0 mb-3" v-show="amountMsg">{{ amountMsg }}</div>

              <!-- 単価 -->
              <div class="form-group d-flex flex-row">
                <label class="col">単価</label>
                <p class="col-7 h5 pl-0">{{ price }}</p>
              </div>

              <!-- 金額 -->
              <div class="form-group d-flex flex-row">
                <label class="col">金額</label>
                <p class="col-7 h5 pl-0">{{ value }}</p>
              </div>

              <!-- 消費税額 -->
              <div class="form-group d-flex flex-row">
                <label class="col">消費税額</label>
                <p class="col-7 h5 pl-0">{{ taxValue }}</p>
              </div>
              <!-- 合計金額 -->
              <div class="form-group d-flex flex-row">
                <label class="col">合計金額</label>
                <p class="col-7 h5 pl-0">{{ totalValue }}</p>
              </div>
            </div>

            <!-- 登録・キャンセルボタン -->
            <div class="form-group d-flex justify-content-center col">
              <div class="col-2">
                <input class="btn btn-primary btn-lg btn-block" type="submit" value="登録" />
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
import * as OrdersUtill from "@/utils/OrdersUtil";
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
      errMsg: "",
      isLoading: false,
      //各項目初期値
      clientNo: "",
      name: "",
      postCode: "",
      address1: "",
      address2: "",
      orderDate: "",
      shipDate: "",
      deliverDate: "",
      productCode: "",
      price: "",
      value: "",
      taxValue: "",
      totalValue: "",
      entryId: "",
      entoryName: "",
      updateId: "",
      updateDate: "",
      clientNoMsg: "",
      orderDateMsg: "",
      shipDateMsg: "",
      deliverDateMsg: "",
      productCodeMsg: "",
      amountMsg: "",
      id: "",
      amount: "",
      orderDateMsg: "",
      productCodeMsg: "",
      productName: "",
      isErr: false,
    };
  },
  async mounted() {
    try {
      //ログイン確認
      if (UserUtil.isLogIn()) {
        // メッセージ設定
        this.msg = this.flashMsg;
        this.errMsg = this.flashErrMsg;
      } else {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
      }
    } catch (e) {
      this.errMsg = e.message;
    }
  },
  methods: {
    /**
     * ユーザー登録
     */
    ordersCreate: async function () {
      // メッセージ初期化
      this.errMsg = "";
      this.clientNoMsg = "";
      this.orderDateMsg = "";
      this.shipDateMsg = "";
      this.deliverDateMsg = "";
      this.productCodeMsg = "";
      this.amountMsg = "";
      this.id;
      this.isLoading = true;
      this.isErr = false;

      try {
        // 入力チェック
        if (this.clientNo.length > 8) {
          this.clientNoMsg = "顧客番号は8桁以内で入力してください。";
          this.isErr = true;
        }
        if (this.productCode.length != 7) {
          this.productCodeMsg = "商品コードは7桁で入力してください。";
          this.isErr = true;
        }

        if (!this.clientNo.match("^[0-9]*$")) {
          this.clientNoMsg = "顧客番号は半角数字で入力してください。";
          this.isErr = true;
        }

        if (!this.productCode.match("^[0-9]*$")) {
          this.productCodeMsg = "商品コードは半角数字で入力してください。";
          this.isErr = true;
        }
        if (!this.amount.match("^[0-9]*$")) {
          this.amountMsg = "数量は半角数字で入力してください。";
          this.isErr = true;
        }

        if ("2016-01-01" > this.orderDate || this.orderDate > "9999-12-31") {
          this.orderDateMsg = "発注日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          this.isErr = true;
        }

        if ("2016-01-01" > this.shipDate || this.sihpDate > "9999-12-31") {
          this.shipDateMsg = "出荷日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          this.isErr = true;
        }

        if ("2016-01-01" > this.deliverDate || this.deliverDate > "9999-12-31") {
          this.deliverDateMsg = "納品日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          this.isErr = true;
        }

        if (0 >= this.amount || this.amount >= 100) {
          this.amountMsg = "数量が誤っています。1以上かつ2桁以内で入力してください。";
          this.isErr = true;
        }
        if (!isNaN(new Date(this.orderDate).getDate)) {
          this.orderDateMsg = "発注日が不正です。yyyy/mm/dd形式で入力してください。";
          this.isErr = true;
        }
        if (!isNaN(new Date(this.shipDate).getDate)) {
          this.shipDateMsg = "出荷日が不正です。yyyy/mm/dd形式で入力してください。";
          this.isErr = true;
        }
        if (!isNaN(new Date(this.deliverDate).getDate)) {
          this.deliverDateMsg = "納品日が不正です。yyyy/mm/dd形式で入力してください。";
          this.isErr = true;
        }
        if (!this.clientData) {
          this.clientNoMsg = "入力された顧客番号は存在しません。";
          this.isErr = true;
        }
        if (!this.productData) {
          this.productCodeMsg = "入力された商品コードは存在しません。";
          this.isErr = true;
        }
        if (this.clientNo == null || this.clientNo === "") {
          this.clientNoMsg = "顧客番号が未入力です。";
          this.isErr = true;
        }
        if (this.orderDate == null || this.orderDate === "") {
          this.orderDateMsg = "発注日が未入力です。";
          this.isErr = true;
        }
        if (this.shipDate == null || this.shipDate === "") {
          this.shipDateMsg = "出荷日が未入力です。";
          this.isErr = true;
        }
        if (this.deliverDate == null || this.deliverDate === "") {
          this.deliverDateMsg = "納品日が未入力です。";
          this.isErr = true;
        }
        if (this.productCode == null || this.productCode === "") {
          this.productCodeMsg = "商品コードが未入力です。";
          this.isErr = true;
        }
        if (this.amount == null || this.amount === "") {
          this.amountMsg = "数量が未入力です。";
          this.isErr = true;
        }
        if (this.isErr) {
          return;
        }

        // 引数格納
        const model = {
          clientNo: this.clientNo,
          orderDate: this.orderDate,
          shipDate: this.shipDate,
          deliverDate: this.deliverDate,
          productCode: this.productCode,
          amount: this.amount,
          updateId: UserUtil.currentUserInfo().id,
          entryId: UserUtil.currentUserInfo().id,
        };

        console.log(model);
        await AjaxUtil.postOrders(model);
        window.alert("受注情報登録処理が完了しました。");
        window.location.href = "/public/pages/orders/list.html";
      } catch (e) {
        window.alert("受注情報登録処理に失敗しました。");
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 顧客情報入力時
     */
    inputClientNo: async function () {
      // メッセージ初期化
      this.errMsg = "";
      this.clientNoMsg = "";
      this.cientNo = "";
      this.name = "";
      this.postCode = "";
      this.address1 = "";
      this.address2 = "";
      this.isLoading = true;
      try {
        if (this.clientNo == null || this.clientNo === "") {
          return;
        }
        if (!this.clientNo.match("^[0-9]*$")) {
          this.clientNoMsg = "商品コードは半角数字で入力してください。";
          return;
        }
        if (this.clientNo.length > 8) {
          this.clientNoMsg = "顧客番号は8桁以内で入力してください。";
          return;
        }

        // 顧客番号から顧客情報を取得
        const response = await AjaxUtil.getClientsByClientNo(this.clientNo);
        const clientData = JSON.parse(response.data.Items);

        if (!clientData) {
          this.clientNoMsg = "入力された顧客番号は存在しません。";
          return;
        }

        // 顧客情報を各項目にセット
        this.clientNo = clientData.client_no.toString().padStart(8, "0");
        this.name = clientData.name;
        this.postCode = clientData.post_code;
        this.address1 = clientData.address1;
        this.address2 = clientData.address2;
      } catch (e) {
        errMsg = "顧客情報取得処理に失敗しました";
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },

    inputProductCode: async function () {
      this.errMsg = "";
      this.productCodeMsg = "";
      this.isLoading = true;
      this.productName = "";
      this.productCode;
      this.price = "";
      try {
        if (this.productCode == null || this.productCode === "") {
          return;
        }
        if (!this.productCode.match("^[0-9]*$")) {
          this.productCodeMsg = "商品コードは半角数字で入力してください。";
          return;
        }
        if (this.productCode.length != 7) {
          this.productCodeMsg = "商品コードは7桁で入力してください。";
          return;
        }

        // 商品コードから商品情報を取得
        const response = await AjaxUtil.getProductsByProductCode(this.productCode);
        const productData = JSON.parse(response.data.Items);

        if (!productData) {
          this.productCodeMsg = "入力された商品コードは存在しません。";
          return;
        }

        // 顧客情報を各項目にセット
        this.productName = productData.product_name;
        this.price = productData.price;

        this.displayValue();
      } catch (e) {
        this.errMsg = "商品情報取得処理に失敗しました。";
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },

    displayValue: function () {
      this.errMsg = "";
      this.productCodeMsg = "";
      this.isLoading = true;
      this.amountMsg = "";
      this.value = "";
      this.taxValue = "";
      this.totalValue = "";
      try {
        if (this.amount == null || this.amount === "") {
          return;
        }
        if (!this.amount.match("^[0-9]*$")) {
          this.amountMsg = "数量は半角数字で入力してください。";
          return;
        }
        if (0 >= this.amount || this.amount >= 100) {
          this.amountMsg = "数量が誤っています。1以上かつ2桁以内で入力してください。";
          return;
        }
        if (this.price == null || this.price === "") {
          return;
        }

        const resultValue = OrdersUtill.calcValue(this.amount, this.price);

        this.value = resultValue.value;
        this.taxValue = resultValue.taxValue;
        this.totalValue = resultValue.totalValue;
      } catch (e) {
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
