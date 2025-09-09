<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light vh-100">
        <div class="container-fluid">
          <h1>受注情報修正</h1>
          <button type="button" class="btn btn-dark" v-on:click="() => $router.push({ name: 'ordersList' })">
            受注情報一覧画面へ
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

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
              <label for="orderDate" class="col">発注日</label>
              <input type="date" id="orderDate" class="form-control col-7" v-model="orderDate" />
            </div>
            <!-- 発注日エラーメッセージ -->
            <div class="text-danger col text-right pr-0 mb-3" v-show="orderDateErrMsg">{{ orderDateErrMsg }}</div>

            <!-- 出荷日 -->
            <div class="form-group d-flex flex-row">
              <label for="shipDate" class="col">出荷日</label>
              <input type="date" id="shipDate" class="form-control col-7" v-model="shipDate" />
            </div>
            <!-- 出荷日エラーメッセージ -->
            <div class="text-danger col text-right pr-0 mb-3" v-show="shipDateErrMsg">{{ shipDateErrMsg }}</div>

            <!-- 納品日 -->
            <div class="form-group d-flex flex-row">
              <label for="deliverDate" class="col">納品日</label>
              <input type="date" id="deliverDate" class="form-control col-7" v-model="deliverDate" />
            </div>
            <!-- 納品日エラーメッセージ -->
            <div class="text-danger col text-right pr-0 mb-3" v-show="deliverDateErrMsg">{{ deliverDateErrMsg }}</div>

            <!-- 商品コード -->
            <div class="form-group d-flex flex-row">
              <label for="productCode" class="col-5">商品コード</label>
              <input
                type="number"
                id="productCode"
                class="form-control col-4"
                v-model="productCode"
                v-on:change="inputProductCode()"
              />
              <!-- 商品情報一覧表示ボタン -->
              <b-button
                variant="form-control col-3 btn btn-secondary ml-2"
                data-toggle="modal"
                data-target="#ListModal"
                v-on:click="onClickProductsList()"
              >
                商品情報一覧
              </b-button>
            </div>
            <!-- 商品コードエラーメッセージ -->
            <div class="text-danger col text-right pr-0 mb-3" v-show="productCodeErrMsg">{{ productCodeErrMsg }}</div>

            <!-- 商品名 -->
            <div class="form-group d-flex flex-row">
              <label class="col">商品名</label>
              <p v-show="productName" class="col-7 pl-0">{{ productName }}</p>
            </div>

            <!-- 数量 -->
            <div class="form-group d-flex flex-row">
              <label for="amount" class="col">数量</label>
              <input
                type="number"
                id="amount"
                class="form-control col-7"
                v-model="amount"
                v-on:change="displayValue()"
              />
            </div>
            <!-- 数量エラーメッセージ -->
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
          <div class="form-group d-flex justify-content-center">
            <div class="p-2 w-25">
              <btn class="btn btn-primary btn-lg btn-block" v-on:click="ordersEdit()">修正</btn>
            </div>
            <div class="p-2 w-25">
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
          <div class="modal-body">
            <!-- インポートしたテーブル -->
            <Table :items="items" :fields="fields" :empDataMsg="'受注情報がありません'" @sendRow="setReceiveRow" />
          </div>
          <div class="modal-footer">
            <!-- 選択ボタン -->
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="((productCode = tmpRow.product_code), inputProductCode())"
              data-dismiss="modal"
              :disabled="tmpRow == null"
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
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as OrdersUtil from "@/utils/OrdersUtil";
import UserConst from "@/utils/const/UserConst";
// 共通
import Header from "../../components/Header.vue";
import "../../utils/sb-admin";
import Loading from "../../components/Loading.vue";
import CancelButton from "../../components/CancelButton.vue";
import Table from "../../components/Table.vue";
export default {
  props: ["flashMsg", "flashErrMsg"],
  components: { Header, Loading, CancelButton, Table },
  data() {
    return {
      isLoading: false,
      isErr: false,

      //テーブル用
      items: [],
      fields: [],
      tmpRow: "",

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
    this.isLoading = true;
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });

        //権限チェック(管理者以外拒否)
      } else if (UserUtil.currentUserInfo().userRole != UserConst.UserRole.admin) {
        this.$router.push({ name: "logIn", params: { flashMsg: "権限がありません" } });
      }

      // メッセージ設定
      this.msg = this.flashMsg;
      this.errMsg = this.flashErrMsg;

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
      //クエリストリングを取得
      const query = this.$route.query;
      //編集対象の伝票番号を設定する
      this.orderNo = query.orderNo;

      try {
        // 伝票番号から顧客・商品情報を結合した受注情報を取得
        const response = await AjaxUtil.getOrdersByOrderNo(this.orderNo);
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

        //計算処理(戻り値は連想配列)を呼び出し、計算結果の項目にセット
        this.calcResults = OrdersUtil.calcValue(this.amount, this.price);
      } catch (e) {
        this.errMsg = "受注情報取得に失敗しました";
        console.log(e);
      }
    },

    /**
     * 商品情報入力時
     */
    async inputProductCode() {
      this.isLoading = true;
      this.productCodeErrMsg = "";
      this.amountErrMsg = "";

      try {
        // 入力チェック
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
          // 存在する場合、顧客情報を各項目にセット
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
        errMsg = "商品情報取得処理に失敗しました";
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

      try {
        // 入力チェック
        if (this.amount == null || this.amount === "") {
          this.amountErrMsg = "数量が未入力です。";
          return;
        }
        if (this.amount <= 0 || 100 <= this.amount) {
          this.amountErrMsg = "数量が誤っています。1以上かつ2桁以内で入力してください。";
          return;
        }
        if (isNaN(this.amount)) {
          this.amountErrMsg = "数量は半角数字で入力してください";
          return;
        }

        //計算処理(戻り値は連想配列)を呼び出し、計算結果の項目にセット
        this.calcResults = OrdersUtil.calcValue(this.amount, this.price);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 商品一覧押下時
     */
    async onClickProductsList() {
      this.isLoading = true;

      // 主キーを一時的に保存する変数を初期化
      this.tmpRow = null;
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
        this.errMsg = "商品情報取得に失敗しました";
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },

    /*
     *一覧のデータ選択時、行を一時的に格納する処理
     */
    setReceiveRow(variousRow) {
      this.tmpRow = variousRow;
    },

    /**
     * 受注情報更新
     */
    async ordersEdit() {
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
        if (isNaN(new Date(this.orderDate))) {
          this.orderDateErrMsg = "発注日が不正です。yyyy/mm/dd形式で入力してください。";
          this.isErr = true;
        }
        if (isNaN(new Date(this.shipDate))) {
          this.shipDateErrMsg = "出荷日が不正です。yyyy/mm/dd形式で入力してください。";
          this.isErr = true;
        }
        if (isNaN(new Date(this.deliverDate))) {
          this.deliverDateErrMsg = "納品日が不正です。yyyy/mm/dd形式で入力してください。";
          this.isErr = true;
        }

        // 商品コードから商品情報を取得
        const response = await AjaxUtil.getProductsByProductCode(this.productCode);
        const productData = JSON.parse(response.data.Items);

        // 存在チェック
        if (!productData) {
          this.productCodeErrMsg = "入力された商品コードは存在しません";
          this.isErr = true;
        }

        // エラーが1つでもあった(trueの)場合、処理を終了
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
