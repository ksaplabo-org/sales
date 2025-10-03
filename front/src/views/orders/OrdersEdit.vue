<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">受注情報修正</h1>
          <button type="button" class="btn btn-dark" v-on:click="() => $router.push({ name: 'ordersList' })">
            受注情報一覧画面へ
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

          <div class="col-lg-5 mx-auto center-block mt-4">
            <!-- 伝票番号 -->
            <div class="form-group row">
              <label class="col-lg-6">伝票番号</label>
              <p v-show="orderNo" class="col-lg-6 h5">{{ orderNo }}</p>
            </div>

            <!-- 顧客番号 -->
            <div class="form-group row">
              <label class="col-lg-6">顧客番号</label>
              <p v-show="clientNo" class="col-lg-6 h5">{{ clientNo }}</p>
            </div>

            <!-- 顧客名 -->
            <div class="form-group row">
              <label class="col-lg-6">顧客名</label>
              <p v-show="name" class="col-lg-6 h5">{{ name }}</p>
            </div>

            <!-- 郵便番号 -->
            <div class="form-group row">
              <label class="col-lg-6">郵便番号</label>
              <p v-show="postCode" class="col-lg-6 h5">{{ postCode }}</p>
            </div>

            <!-- 住所1 -->
            <div class="form-group row">
              <label class="col-lg-6">住所1</label>
              <p v-show="address1" class="col-lg-6 h5">{{ address1 }}</p>
            </div>

            <!-- 住所2 -->
            <div class="form-group row">
              <label class="col-lg-6">住所2</label>
              <p v-show="address2" class="col-lg-6 h5">{{ address2 }}</p>
            </div>

            <!-- 発注日 -->
            <div class="form-group row">
              <label for="orderDate" class="col-lg-6">発注日<span class="text-danger">*</span></label>
              <div class="col-lg-6">
                <input
                  id="orderDate"
                  type="date"
                  min="2016-01-01"
                  max="9999-12-31"
                  class="form-control"
                  v-model="orderDate"
                />
                <!-- 発注日エラーメッセージ -->
                <div class="text-danger small" v-show="orderDateErrMsg">{{ orderDateErrMsg }}</div>
              </div>
            </div>

            <!-- 出荷日 -->
            <div class="form-group row">
              <label for="shipDate" class="col-lg-6">出荷日<span class="text-danger">*</span></label>
              <div class="col-lg-6">
                <input
                  id="shipDate"
                  type="date"
                  min="2016-01-01"
                  max="9999-12-31"
                  class="form-control"
                  v-model="shipDate"
                />
                <!-- 出荷日エラーメッセージ -->
                <div class="text-danger small" v-show="shipDateErrMsg">{{ shipDateErrMsg }}</div>
              </div>
            </div>

            <!-- 納品日 -->
            <div class="form-group row">
              <label for="deliverDate" class="col-lg-6">納品日<span class="text-danger">*</span></label>
              <div class="col-lg-6">
                <input
                  id="deliverDate"
                  type="date"
                  min="2016-01-01"
                  max="9999-12-31"
                  class="form-control"
                  v-model="deliverDate"
                />
                <!-- 納品日エラーメッセージ -->
                <div class="text-danger small" v-show="deliverDateErrMsg">{{ deliverDateErrMsg }}</div>
              </div>
            </div>

            <!-- 商品コード -->
            <div class="form-group d-lg-flex flex-lg-row">
              <label for="productCode" class="col-lg-6 pl-0">商品コード<span class="text-danger">*</span></label>
              <div class="pl-0 col-lg-6 pl-lg-3">
                <input
                  id="productCode"
                  type="number"
                  min="1000001"
                  max="9999999"
                  class="form-control"
                  v-model="productCode"
                  v-on:change="inputProductCode()"
                />
                <!-- 商品コードエラーメッセージ -->
                <div class="text-danger small" v-show="productCodeErrMsg">
                  {{ productCodeErrMsg }}
                </div>
              </div>
              <!-- 商品情報一覧表示ボタン -->
              <b-button
                variant="form-control btn btn-secondary"
                class="col-11 mt-3 col-lg-4 mt-lg-0"
                data-toggle="modal"
                data-target="#ListModal"
                style="height: 40px"
                v-on:click="onClickProductsList()"
              >
                商品情報一覧
              </b-button>
            </div>

            <!-- 商品名 -->
            <div class="form-group row">
              <label class="col-lg-6">商品名</label>
              <p v-show="productName" class="col-lg-6 h5">{{ productName }}</p>
            </div>

            <!-- 数量 -->
            <div class="form-group row">
              <label for="amount" class="col-lg-6">数量<span class="text-danger">*</span></label>
              <div class="col-lg-6">
                <input type="number" id="amount" class="form-control" v-model="amount" v-on:change="displayValue()" />
                <!-- 数量エラーメッセージ -->
                <div class="text-danger small" v-show="amountErrMsg">
                  {{ amountErrMsg }}
                </div>
              </div>
            </div>

            <!-- 単価 -->
            <div class="form-group row">
              <label class="col-lg-6">単価</label>
              <p v-show="price" class="col-lg-6 h5">{{ price }}</p>
            </div>

            <!-- 金額 -->
            <div class="form-group row">
              <label class="col-lg-6">金額</label>
              <p v-show="totalPriceWithoutTax" class="col-lg-6 h5">{{ totalPriceWithoutTax }}</p>
            </div>

            <!-- 消費税額 -->
            <div class="form-group row">
              <label class="col-lg-6">消費税額</label>
              <p v-show="tax" class="col-lg-6 h5">{{ tax }}</p>
            </div>

            <!-- 合計金額 -->
            <div class="form-group row">
              <label class="col-lg-6">合計金額</label>
              <p v-show="totalPricePlusTax" class="col-lg-6 h5">{{ totalPricePlusTax }}</p>
            </div>
          </div>
          <!-- 修正・キャンセルボタン -->
          <div class="form-group justify-content-center row">
            <div class="mb-3 col-lg-4">
              <btn class="btn btn-info btn-lg btn-block" v-on:click="ordersEdit()">修正</btn>
            </div>
            <div class="col-lg-4">
              <CancelButton />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 一覧モーダルStart -->
    <div
      class="modal fade"
      id="ListModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <p class="modal-title font-weight-bold text-secondary" id="myModalLabel">商品情報一覧</p>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <p class="text-danger ml-3" v-show="modalErrMsg">{{ modalErrMsg }}</p>
          <div class="modal-body">
            <!-- インポートしたテーブル -->
            <Table :items="items" :fields="fields" :empDataMsg="'受注情報がありません'" @sendRow="setReceiveRow" />
          </div>
          <div class="modal-footer">
            <!-- 選択ボタン -->
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="((productCode = tmpProductRow.product_code), inputProductCode())"
              data-dismiss="modal"
              :disabled="tmpProductRow == null"
            >
              選択
            </button>
            <!-- 閉じるボタン -->
            <button type="button" class="btn btn-secondary" data-dismiss="modal">閉じる</button>
          </div>
        </div>
      </div>
      <!-- 一覧モーダルEnd -->
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
// 共通設定
import "../../utils/sb-admin";

// util関連
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as OrdersUtil from "@/utils/OrdersUtil";

// コンポーネント関連
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
import CancelButton from "@/components/CancelButton.vue";
import Table from "@/components/Table.vue";

export default {
  components: { Header, Loading, CancelButton, Table },
  data() {
    return {
      isLoading: false,

      //テーブル用
      items: [],
      fields: [],
      tmpProductRow: null,

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
      totalPriceWithoutTax: "",
      tax: "",
      totalPricePlusTax: "",
      updateId: "",

      //エラーメッセージ
      errMsg: "",
      modalErrMsg: "",
      orderDateErrMsg: "",
      shipDateErrMsg: "",
      deliverDateErrMsg: "",
      productCodeErrMsg: "",
      amountErrMsg: "",
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
      }

      // 画面更新処理を呼び出す
      await this.updateView();
    } catch (e) {
      this.errMsg = e.message;
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    /**
     * 画面更新
     */
    async updateView() {
      // クエリストリングを取得
      const query = this.$route.query;

      try {
        // 伝票番号から顧客・商品情報を結合した受注情報を取得
        const response = await AjaxUtil.getOrdersByOrderNo(query.orderNo);
        const orderData = JSON.parse(response.data.Items);

        // 受注情報を各項目にセット
        this.orderNo = orderData.order_no;
        // 顧客番号の0埋め処理
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

        // 金額計算処理
        this.totalPriceWithoutTax = this.amount * this.price;
        const calcResults = OrdersUtil.calcTax(this.totalPriceWithoutTax);
        this.tax = calcResults.tax;
        this.totalPricePlusTax = calcResults.totalPricePlusTax;
      } catch (e) {
        this.errMsg = "受注情報取得処理に失敗しました。";
        console.log(e);
      }
    },

    /**
     * 商品情報入力時
     */
    async inputProductCode() {
      this.isLoading = true;
      this.productCodeErrMsg = "";
      this.productName = "";
      this.price = "";

      try {
        // 商品コードの入力チェック
        if 
        (this.productCode == null || this.productCode === "") {
          return;
        }
        if (isNaN(this.productCode)) {
          this.productCodeErrMsg = "商品コードは半角数字で入力してください。";
          return;
        }
        if (String(this.productCode).length != 7) {
          this.productCodeErrMsg = "商品コードは7桁で入力してください。";
          return;
        }

        // 商品コードから商品情報を取得
        const response = await AjaxUtil.getProductsByProductCode(this.productCode);
        const productData = JSON.parse(response.data.Items);

        if (productData) {
          // 存在する場合、商品情報を各項目にセット
          this.productCode = productData.product_code;
          this.productName = productData.product_name;
          this.price = productData.price;

          // 金額表示処理を呼び出す
          this.displayValue();
        } else {
          // 存在しない場合、エラーメッセージを表示
          this.productCodeErrMsg = "入力された商品コードは存在しません。";
        }
      } catch (e) {
        errMsg = "商品情報取得処理に失敗しました。";
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 金額情報表示処理
     */
    displayValue() {
      this.isLoading = true;
      this.amountErrMsg = "";
      this.totalPriceWithoutTax = "";
      this.tax = "";
      this.totalPricePlusTax = "";

      try {
        // 数量の入力チェック
        if (this.amount == null || this.amount === "") {
          return;
        }
        if (this.amount <= 0 || 100 <= this.amount) {
          this.amountErrMsg = "数量が誤っています。1以上かつ2桁以内で入力してください。";
          return;
        }
        if (isNaN(this.amount)) {
          this.amountErrMsg = "数量は半角数字で入力してください。";
          return;
        }
        // 単価の入力チェック
        if (this.price == null) {
          return;
        }

        // 金額計算処理
        this.totalPriceWithoutTax = this.amount * this.price;
        const calcResults = OrdersUtil.calcTax(this.totalPriceWithoutTax);
        this.tax = calcResults.tax;
        this.totalPricePlusTax = calcResults.totalPricePlusTax;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 商品一覧押下時
     */
    async onClickProductsList() {
      this.isLoading = true;

      // 主キーを一時的に保持する変数を初期化
      this.tmpProductRow = null;

      // テーブル定義初期化
      this.items = [];
      this.fields = [];

      try {
        // 商品情報を全件取得し、テーブルで使用する項目へ代入
        const response = await AjaxUtil.getProducts();
        this.items = JSON.parse(response.data.Items);

        // テーブル定義
        this.fields = [
          { key: "product_code", label: "商品コード", sortable: true },
          { key: "product_name", label: "商品名", sortable: false },
          { key: "price", label: "単価", sortable: false },
        ];
      } catch (e) {
        this.modalErrMsg = "商品情報取得処理に失敗しました。";
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },

    /*
     *一覧のデータ選択時、行を一時的に格納する処理
     */
    setReceiveRow(productRow) {
      this.tmpProductRow = productRow;
    },

    /**
     * 受注情報更新
     */
    async ordersEdit() {
      this.isLoading = true;

      // jsの月の仕様が0が1月、11が12月になっているのでこの書き方
      const maxDate = new Date(9999, 11, 31); // 日付範囲の上限(9999/12/31)
      const minDate = new Date(2016, 0, 1); // 日付範囲の下限(2016/01/01)

      // Date同士での比較ができるように、string型で入力されたものをDate型へ変換
      const orderDate = new Date(this.orderDate);
      const shipDate = new Date(this.shipDate);
      const deliverDate = new Date(this.deliverDate);

      // メッセージ初期化
      this.errMsg = "";
      this.orderDateErrMsg = "";
      this.shipDateErrMsg = "";
      this.deliverDateErrMsg = "";
      this.productCodeErrMsg = "";
      this.amountErrMsg = "";

      // エラーが1つでもあるかどうかチェックする用
      let isErr = false;

      try {
        // 発注日の入力チェック
        if (this.orderDate == null || this.orderDate === "") {
          this.orderDateErrMsg = "発注日が未入力です。";
          isErr = true;
        } else if (isNaN(orderDate.getDate())) {
          this.orderDateErrMsg = "発注日が不正です。yyyy/mm/dd形式で入力してください。";
          isErr = true;
        } else if (orderDate < minDate || maxDate < orderDate) {
          this.orderDateErrMsg = "発注日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          isErr = true;
        }

        // 出荷日の入力チェック
        if (this.shipDate == null || this.shipDate === "") {
          this.shipDateErrMsg = "出荷日が未入力です。";
          isErr = true;
        } else if (isNaN(shipDate.getDate())) {
          this.shipDateErrMsg = "出荷日が不正です。yyyy/mm/dd形式で入力してください。";
          isErr = true;
        } else if (shipDate < minDate || maxDate < shipDate) {
          this.shipDateErrMsg = "出荷日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          isErr = true;
        }

        // 納品日の入力チェック
        if (this.deliverDate == null || this.deliverDate === "") {
          this.deliverDateErrMsg = "納品日が未入力です。";
          isErr = true;
        } else if (isNaN(deliverDate.getDate())) {
          this.deliverDateErrMsg = "納品日が不正です。yyyy/mm/dd形式で入力してください。";
          isErr = true;
        } else if (deliverDate < minDate || maxDate < deliverDate) {
          this.deliverDateErrMsg = "納品日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          isErr = true;
        }

        // 商品コードの入力チェック
        if (this.productCode == null || this.productCode === "") {
          this.productCodeErrMsg = "商品コードが未入力です。";
          isErr = true;
        } else if (isNaN(this.productCode)) {
          this.productCodeErrMsg = "商品コードは半角数字で入力してください。";
          isErr = true;
        } else if (String(this.productCode).length != 7) {
          this.productCodeErrMsg = "商品コードは7桁で入力してください。";
          isErr = true;
        } else {
          // 商品コードから商品情報を取得
          const response = await AjaxUtil.getProductsByProductCode(this.productCode);
          const productData = JSON.parse(response.data.Items);
          // 存在チェック
          if (!productData) {
            this.productCodeErrMsg = "入力された商品コードは存在しません。";
            isErr = true;
          }
        }

        // 数量の入力チェック
        if (this.amount == null || this.amount === "") {
          this.amountErrMsg = "数量が未入力です。";
          isErr = true;
        } else if (isNaN(this.amount)) {
          this.amountErrMsg = "数量は半角数字で入力してください。";
          isErr = true;
        } else if (this.amount <= 0 || 100 <= this.amount) {
          this.amountErrMsg = "数量が誤っています。1以上かつ2桁以内で入力してください。";
          isErr = true;
        }

        // エラーが1つでもあった(trueの)場合、処理を終了
        if (isErr) {
          return;
        }

        // 引数格納
        const model = {
          orderNo: this.orderNo,
          orderDate: orderDate,
          shipDate: shipDate,
          deliverDate: deliverDate,
          productCode: this.productCode,
          amount: this.amount,
          //ログイン中ユーザーのidを取得
          updateId: UserUtil.currentUserInfo().id,
        };

        // 受注情報修正処理
        await AjaxUtil.putOrders(model);

        window.alert("受注情報修正処理が完了しました。");
        this.$router.push({ name: "ordersList" });
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
