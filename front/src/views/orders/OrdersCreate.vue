<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">受注情報登録</h1>
          <button type="button" class="btn btn-dark" v-on:click="() => $router.push({ name: 'ordersList' })">
            受注情報一覧画面へ
          </button>
          <br />
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

          <form @submit.stop.prevent="ordersCreate" method="post" autocomplete="new-password">
            <div class="col-lg-5 mx-auto center-block">
              <!-- 伝票番号 -->
              <div class="form-group row">
                <label class="col-lg-6">伝票番号</label>
                <p class="col-lg-6 h5">自動で登録されます</p>
              </div>
              <!-- 顧客番号 -->
              <div class="form-group d-lg-flex flex-lg-row">
                <label class="col-lg-6 pl-0">顧客番号<label class="text-danger">*</label></label>
                <div class="pl-0 col-lg-6 pl-lg-3">
                  <input
                    type="number"
                    id="clientNo"
                    class="form-control"
                    placeholder="8桁以内で入力してください"
                    v-model="clientNo"
                    autocomplete="off"
                    max="99999999"
                    min="1"
                    @change="inputClientNo()"
                  />
                  <div class="text-danger small" v-show="clientNoMsg">{{ clientNoMsg }}</div>
                </div>
                <!-- 顧客情報一覧表示ボタン -->
                <b-button
                  variant="form-control btn btn-secondary ml-0"
                  class="col-10 mt-3 col-lg-4 mt-lg-0"
                  data-toggle="modal"
                  data-target="#ClientsListModal"
                  style="height: 40px"
                  v-on:click="onClickClientsList()"
                  >顧客情報一覧</b-button
                >
              </div>

              <!-- 顧客名 -->
              <div class="form-group row">
                <label class="col-lg-6">顧客名</label>
                <p class="col-lg-6 h5">{{ name }}</p>
              </div>
              <!-- 郵便番号 -->
              <div class="form-group row">
                <label class="col-lg-6">郵便番号</label>
                <p class="col-lg-6 h5">{{ postCode }}</p>
              </div>
              <!-- 住所１ -->
              <div class="form-group row">
                <label class="col-lg-6">住所１</label>
                <p class="col-lg-6 h5">{{ address1 }}</p>
              </div>

              <!-- 住所２ -->
              <div class="form-group row">
                <label class="col-lg-6">住所２</label>
                <p class="col-lg-6 h5">{{ address2 }}</p>
              </div>

              <!-- 発注日 -->
              <div class="form-group row">
                <label class="col-lg-6">発注日<label class="text-danger">*</label></label>
                <div class="col-lg-6">
                  <input
                    type="date"
                    id="orderDate"
                    class="form-control"
                    v-model="orderDate"
                    max="9999-12-31"
                    min="2016-01-01"
                  />
                  <div class="text-danger small" v-show="orderDateMsg">{{ orderDateMsg }}</div>
                </div>
              </div>

              <!-- 出荷日 -->
              <div class="form-group row">
                <label class="col-lg-6">出荷日<label class="text-danger">*</label></label>
                <div class="col-lg-6">
                  <input
                    type="date"
                    id="shipDate"
                    class="form-control"
                    v-model="shipDate"
                    max="9999-12-31"
                    min="2016-01-01"
                  />
                  <div class="text-danger small" v-show="shipDateMsg">{{ shipDateMsg }}</div>
                </div>
              </div>

              <!-- 納品日 -->
              <div class="form-group row">
                <label class="col-lg-6">納品日<label class="text-danger">*</label></label>
                <div class="col-lg-6">
                  <input
                    type="date"
                    id="deliverDate"
                    class="form-control"
                    v-model="deliverDate"
                    max="9999-12-31"
                    min="2016-01-01"
                  />
                  <div class="text-danger small" v-show="deliverDateMsg">
                    {{ deliverDateMsg }}
                  </div>
                </div>
              </div>
              <!-- 商品コード -->
              <div class="form-group d-lg-flex flex-lg-row">
                <label class="col-lg-6 pl-0">商品コード<label class="text-danger">*</label></label>
                <div class="pl-0 col-lg-6 pl-lg-3">
                  <input
                    type="number"
                    id="productCode"
                    class="form-control"
                    placeholder="7桁で入力してください"
                    v-model="productCode"
                    max="9999999"
                    min="1000001"
                    @change="inputProductCode()"
                  />
                  <div class="text-danger small" v-show="productCodeMsg">
                    {{ productCodeMsg }}
                  </div>
                </div>
                <!-- 商品情報一覧表示ボタン -->
                <b-button
                  variant="form-control  btn btn-secondary ml-0"
                  class="col-10 mt-3 col-lg-4 mt-lg-0"
                  data-toggle="modal"
                  data-target="#ProductsListModal"
                  style="height: 40px"
                  v-on:click="onClickProductsList()"
                >
                  商品情報一覧
                </b-button>
              </div>

              <!-- 商品名 -->
              <div class="form-group row">
                <label class="col-lg-6">商品名</label>
                <p class="col-lg-6 h5">{{ productName }}</p>
              </div>

              <!-- 数量 -->
              <div class="form-group row">
                <label class="col-lg-6">数量<label class="text-danger">*</label></label>
                <div class="pl-0 col-lg-6 pl-lg-3">
                  <input
                    type="number"
                    id="amount"
                    class="form-control"
                    placeholder="2桁以内で入力してください"
                    v-model="amount"
                    max="99"
                    min="1"
                    @change="displayValue()"
                  />
                  <div class="text-danger small" v-show="amountMsg">{{ amountMsg }}</div>
                </div>
              </div>

              <!-- 単価 -->
              <div class="form-group row">
                <label class="col-lg-6">単価</label>
                <p class="col-lg-6 h5">{{ price }}</p>
              </div>

              <!-- 金額 -->
              <div class="form-group row">
                <label class="col-lg-6">金額</label>
                <p class="col-lg-6 h5">{{ value }}</p>
              </div>

              <!-- 消費税額 -->
              <div class="form-group row">
                <label class="col-lg-6">消費税額</label>
                <p class="col-lg-6 h5">{{ taxValue }}</p>
              </div>
              <!-- 合計金額 -->
              <div class="form-group row">
                <label class="col-lg-6">合計金額</label>
                <p class="col-lg-6 h5">{{ totalValue }}</p>
              </div>
            </div>

            <!-- 登録・キャンセルボタン -->
            <div class="form-group justify-content-center row">
              <div class="mb-3 col-lg-4">
                <input class="btn btn-primary btn-lg btn-block" type="submit" value="登録" />
              </div>
              <div class="col-lg-4">
                <CancelButton />
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- 商品情報一覧モーダルStart -->
      <div
        class="modal fade"
        id="ProductsListModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="productsModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <p class="modal-title font-weight-bold text-secondary" id="productsModalLabel">商品情報一覧</p>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p class="text-danger" v-show="modalErrMsg">{{ modalErrMsg }}</p>
              <!-- インポートしたテーブル -->
              <Table :items="items" :fields="fields" :empDataMsg="'商品情報がありません'" @sendRow="setReceiveRow" />
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
      </div>
      <!-- 商品情報一覧モーダルEnd -->

      <!-- 顧客情報一覧モーダルStart -->
      <div
        class="modal fade"
        id="ClientsListModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="clientsModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <p class="modal-title font-weight-bold text-secondary" id="clientsModalLabel">顧客情報一覧</p>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p class="text-danger" v-show="modalErrMsg">{{ modalErrMsg }}</p>
              <!-- インポートしたテーブル -->
              <Table :items="items" :fields="fields" :empDataMsg="'顧客情報がありません'" @sendRow="setReceiveRow" />
            </div>
            <div class="modal-footer">
              <!-- 選択ボタン -->
              <button
                type="button"
                class="btn btn-primary"
                v-on:click="((clientNo = tmpRow.client_no), inputClientNo())"
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
      </div>
      <!-- 顧客情報一覧モーダルEnd -->
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
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as OrdersUtil from "@/utils/OrdersUtil";
import * as UserUtil from "@/utils/UserUtil";
// 共通
import CancelButton from "@/components/CancelButton.vue";
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
import Table from "@/components/Table.vue";
export default {
  props: ["flashMsg", "flashErrMsg"],
  components: { Header, Loading, CancelButton, Table },
  data() {
    return {
      errMsg: "",
      modalErrMsg: "",
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
      updateId: "",
      clientNoMsg: "",
      orderDateMsg: "",
      shipDateMsg: "",
      deliverDateMsg: "",
      productCodeMsg: "",
      amountMsg: "",
      id: "",
      amount: "",
      productName: "",
      clientData: "",
      productData: "",
      databaseErr: false,

      //テーブル用
      items: [],
      fields: [],
      tmpRow: null,
    };
  },
  async mounted() {
    try {
      //ログイン確認
      if (UserUtil.isLogIn()) {
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
    async ordersCreate() {
      // メッセージ初期化
      this.errMsg = "";
      this.clientNoMsg = "";
      this.orderDateMsg = "";
      this.shipDateMsg = "";
      this.deliverDateMsg = "";
      this.productCodeMsg = "";
      this.amountMsg = "";
      this.isLoading = true;
      let isErr = false;

      if (this.databaseErr) {
        window.alert("受注情報登録処理に失敗しました。");
        this.isLoading = false;
        return;
      }
      try {
        // 入力チェック
        if (!this.clientData) {
          this.clientNoMsg = "入力された顧客番号は存在しません。";
          isErr = true;
        }
        if (!this.productData) {
          this.productCodeMsg = "入力された商品コードは存在しません。";
          isErr = true;
        }
        if (String(this.clientNo).length > 8) {
          this.clientNoMsg = "顧客番号は8桁以内で入力してください。";
          isErr = true;
        }
        if (String(this.productCode).length != 7) {
          this.productCodeMsg = "商品コードは7桁で入力してください。";
          isErr = true;
        }

        if (!this.clientNo.match("^[0-9]*$")) {
          this.clientNoMsg = "顧客番号は半角数字で入力してください。";
          isErr = true;
        }

        if (!this.productCode.match("^[0-9]*$")) {
          this.productCodeMsg = "商品コードは半角数字で入力してください。";
          isErr = true;
        }
        if (!this.amount.match("^[0-9]*$")) {
          this.amountMsg = "数量は半角数字で入力してください。";
          isErr = true;
        }

        if ("2016-01-01" > this.orderDate || this.orderDate > "9999-12-31") {
          this.orderDateMsg = "発注日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          isErr = true;
        }

        if ("2016-01-01" > this.shipDate || this.shipDate > "9999-12-31") {
          this.shipDateMsg = "出荷日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          isErr = true;
        }

        if ("2016-01-01" > this.deliverDate || this.deliverDate > "9999-12-31") {
          this.deliverDateMsg = "納品日が不正です。2016/01/01～9999/12/31の間で指定してください。";
          isErr = true;
        }

        if (0 >= this.amount || this.amount >= 100) {
          this.amountMsg = "数量が誤っています。1以上かつ2桁以内で入力してください。";
          isErr = true;
        }
        if (isNaN(new Date(this.orderDate).getDate())) {
          this.orderDateMsg = "発注日が不正です。yyyy/mm/dd形式で入力してください。";
          isErr = true;
        }
        if (isNaN(new Date(this.shipDate).getDate())) {
          this.shipDateMsg = "出荷日が不正です。yyyy/mm/dd形式で入力してください。";
          isErr = true;
        }
        if (isNaN(new Date(this.deliverDate).getDate())) {
          this.deliverDateMsg = "納品日が不正です。yyyy/mm/dd形式で入力してください。";
          isErr = true;
        }
        if (this.clientNo == null || this.clientNo === "") {
          this.clientNoMsg = "顧客番号が未入力です。";
          isErr = true;
        }
        if (this.orderDate == null || this.orderDate === "") {
          this.orderDateMsg = "発注日が未入力です。";
          isErr = true;
        }
        if (this.shipDate == null || this.shipDate === "") {
          this.shipDateMsg = "出荷日が未入力です。";
          isErr = true;
        }
        if (this.deliverDate == null || this.deliverDate === "") {
          this.deliverDateMsg = "納品日が未入力です。";
          isErr = true;
        }
        if (this.productCode == null || this.productCode === "") {
          this.productCodeMsg = "商品コードが未入力です。";
          isErr = true;
        }
        if (this.amount == null || this.amount === "") {
          this.amountMsg = "数量が未入力です。";
          isErr = true;
        }

        if (isErr) {
          return;
        }

        // 引数格納
        const model = {
          clientNo: Number(this.clientNo),
          orderDate: this.orderDate,
          shipDate: this.shipDate,
          deliverDate: this.deliverDate,
          productCode: this.productCode,
          amount: this.amount,
          updateId: UserUtil.currentUserInfo().id,
          entryId: UserUtil.currentUserInfo().id,
        };
        const result = await AjaxUtil.postOrders(model);
        console.log(result.e);

        window.alert("受注情報登録処理が完了しました。");
      } catch (e) {
        if (e.response.status === 400) {
          window.alert("一日の登録上限を超えています。");
          console.log(e);
        } else {
          window.alert("受注情報登録処理に失敗しました。");
          console.log(e);
          return;
        }
      } finally {
        this.isLoading = false;
      }
      this.$router.push({ name: "ordersList" });
    },

    /**
     * 顧客情報入力時
     */
    async inputClientNo() {
      // メッセージ初期化
      this.errMsg = "";
      this.clientNoMsg = "";
      this.name = "";
      this.postCode = "";
      this.address1 = "";
      this.address2 = "";
      this.clientData = "";
      this.databaseErr = false;
      this.isLoading = true;
      try {
        if (this.clientNo == null || this.clientNo === "") {
          return;
        }
        if (!String(this.clientNo).match("^[0-9]*$")) {
          this.clientNoMsg = "顧客番号は半角数字で入力してください。";
          return;
        }
        if (String(this.clientNo).length > 8) {
          this.clientNoMsg = "顧客番号は8桁以内で入力してください。";
          return;
        }

        // 顧客番号から顧客情報を取得
        const response = await AjaxUtil.getClientsByClientNo(Number(this.clientNo));
        this.clientData = JSON.parse(response.data.Items);

        if (!this.clientData) {
          this.clientNoMsg = "入力された顧客番号は存在しません。";
          return;
        }

        // 顧客情報を各項目にセット
        this.clientNo = this.clientData.client_no.toString().padStart(8, "0");
        this.name = this.clientData.name;
        this.postCode = this.clientData.post_code;
        this.address1 = this.clientData.address1;
        this.address2 = this.clientData.address2;
      } catch (e) {
        this.errMsg = "顧客情報取得処理に失敗しました。";
        console.log(e);
        this.databaseErr = true;
      } finally {
        this.isLoading = false;
      }
    },

    async inputProductCode() {
      this.errMsg = "";
      this.productCodeMsg = "";
      this.productName = "";
      this.productData = "";
      this.price = "";
      this.databaseErr = false;
      this.isLoading = true;
      try {
        if (this.productCode == null || this.productCode === "") {
          return;
        }
        if (!String(this.productCode).match("^[0-9]*$")) {
          this.productCodeMsg = "商品コードは半角数字で入力してください。";
          return;
        }
        if (String(this.productCode).length != 7) {
          this.productCodeMsg = "商品コードは7桁で入力してください。";
          return;
        }

        // 商品コードから商品情報を取得
        const response = await AjaxUtil.getProductsByProductCode(this.productCode);
        this.productData = JSON.parse(response.data.Items);

        if (!this.productData) {
          this.productCodeMsg = "入力された商品コードは存在しません。";
          return;
        }

        // 商品情報を各項目にセット
        this.productName = this.productData.product_name;
        this.price = this.productData.price;

        this.displayValue();
      } catch (e) {
        this.errMsg = "商品情報取得処理に失敗しました。";
        console.log(e);
        this.databaseErr = true;
      } finally {
        this.isLoading = false;
      }
    },

    displayValue() {
      this.errMsg = "";
      this.productCodeMsg = "";
      this.amountMsg = "";
      this.value = "";
      this.taxValue = "";
      this.totalValue = "";
      this.isLoading = true;
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

        const resultValue = OrdersUtil.calcValue(this.amount, this.price);

        this.value = resultValue.value;
        this.taxValue = resultValue.taxValue;
        this.totalValue = resultValue.totalValue;
      } catch (e) {
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * 商品情報一覧押下時
     */
    async onClickProductsList() {
      this.isLoading = true;
      this.modalErrMsg = "";

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
        this.modalErrMsg = "商品情報取得処理に失敗しました。";
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 顧客情報一覧押下時
     */
    async onClickClientsList() {
      this.isLoading = true;
      this.modalErrMsg = "";

      // 主キーを一時的に保存する変数を初期化
      this.tmpRow = null;
      // テーブル定義初期化
      this.items = [];
      this.fields = [];

      try {
        // 顧客情報を全件取得し、テーブルで使用する項目へ代入
        const response = await AjaxUtil.getClients();
        this.items = JSON.parse(response.data.Items);

        // テーブル定義
        this.fields = [
          { key: "client_no", label: "顧客番号", sortable: true },
          { key: "name", label: "顧客名", sortable: false },
          { key: "post_code", label: "郵便番号", sortable: false },
          { key: "address1", label: "住所1", sortable: false },
          { key: "address2", label: "住所2", sortable: false },
          { key: "tel_no", label: "電話番号", sortable: false },
        ];
      } catch (e) {
        this.modalErrMsg = "顧客情報取得処理に失敗しました。";
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
  },
};
</script>
