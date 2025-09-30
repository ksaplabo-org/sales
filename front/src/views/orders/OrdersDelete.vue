<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">受注情報削除</h1>
          <button type="button" class="btn btn-dark mb-4" v-on:click="() => $router.push({ name: 'ordersList' })">
            受注情報一覧画面へ
          </button>
          <br />
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>
          <br />

          <div class="col-sm-5 mx-auto center-block">
            <div class="" />

            <!-- 伝票番号 -->
            <div class="form-group row">
              <label class="col-sm-6">伝票番号</label>
              <p v-show="orderNo" class="col-sm-6 h5">{{ orderNo }}</p>
            </div>

            <!-- 顧客番号 -->
            <div class="form-group row">
              <label class="col-sm-6">顧客番号</label>
              <p v-show="clientNo" class="col-sm-6 h5">{{ clientNo }}</p>
            </div>

            <!-- 顧客名 -->
            <div class="form-group row">
              <label class="col-sm-6">顧客名</label>
              <p v-show="name" class="col-sm-6 h5">{{ name }}</p>
            </div>

            <!-- 郵便番号 -->
            <div class="form-group row">
              <label class="col-sm-6">郵便番号</label>
              <p v-show="postCode" class="col-sm-6 h5">{{ postCode }}</p>
            </div>

            <!-- 住所1 -->
            <div class="form-group row">
              <label class="col-sm-6">住所1</label>
              <p v-show="address1" class="col-sm-6 h5">{{ address1 }}</p>
            </div>

            <!-- 住所2 -->
            <div class="form-group row">
              <label class="col-sm-6">住所2</label>
              <p v-show="address2" class="col-sm-6 h5">{{ address2 }}</p>
            </div>

            <!-- 発注日 -->
            <div class="form-group row">
              <label for="orderDate" class="col-sm-6">発注日</label>
              <p v-show="orderDate" class="col-sm-6 h5">{{ orderDate }}</p>
            </div>

            <!-- 出荷日 -->
            <div class="form-group row">
              <label for="shipDate" class="col-sm-6">出荷日</label>
              <p v-show="shipDate" class="col-sm-6 h5">{{ shipDate }}</p>
            </div>

            <!-- 納品日 -->
            <div class="form-group row">
              <label for="deliverDate" class="col-sm-6">納品日</label>
              <p v-show="deliverDate" class="col-sm-6 h5">{{ deliverDate }}</p>
            </div>

            <!-- 商品コード -->
            <div class="form-group row">
              <label for="productCode" class="col-sm-6">商品コード</label>
              <p v-show="productCode" class="col-sm-6 h5">{{ productCode }}</p>
            </div>

            <!-- 商品名 -->
            <div class="form-group row">
              <label for="productName" class="col-sm-6">商品名</label>
              <p v-show="productName" class="col-sm-6 h5">{{ productName }}</p>
            </div>

            <!-- 数量 -->
            <div class="form-group row">
              <label for="amount" class="col-sm-6">数量</label>
              <p v-show="amount" class="col-sm-6 h5">{{ amount }}</p>
            </div>

            <!-- 単価 -->
            <div class="form-group row">
              <label for="price" class="col-sm-6">単価</label>
              <p v-show="price" class="col-sm-6 h5">{{ price }}</p>
            </div>

            <!-- 金額 -->
            <div class="form-group row">
              <label for="calcResults" class="col-sm-6">金額</label>
              <p v-show="calcResults" class="col-sm-6 h5">{{ calcResults.value }}</p>
            </div>

            <!-- 消費税額 -->
            <div class="form-group row">
              <label for="calcResults" class="col-sm-6">消費税額</label>
              <p v-show="calcResults" class="col-sm-6 h5">{{ calcResults.taxValue }}</p>
            </div>

            <!-- 合計金額 -->
            <div class="form-group row">
              <label for="calcResults" class="col-sm-6">合計金額</label>
              <p v-show="calcResults" class="col-sm-6 h5">{{ calcResults.totalValue }}</p>
            </div>
          </div>
          <!-- 削除 -->
          <div class="form-group justify-content-center row">
            <div class="col-sm-6">
              <button class="btn btn-danger btn-sm btn-block" v-on:click="ordersDelete()">削除</button>
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
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as OrdersUtil from "@/utils/OrdersUtil";
import * as UserUtil from "@/utils/UserUtil";
// 共通
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
export default {
  props: ["flashMsg", "flashErrMsg"],
  components: { Header, Loading },
  data() {
    return {
      isLoading: false,
      
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

      //エラーメッセージ
      errMsg: "",
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
      //クエリストリングを取得
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
        this.orderDate = String(orderData.order_date).replace(/-/g, "/");
        this.shipDate = String(orderData.ship_date).replace(/-/g, "/");
        this.deliverDate = String(orderData.deliver_date).replace(/-/g, "/");
        this.productCode = orderData.product.product_code;
        this.productName = orderData.product.product_name;
        this.amount = orderData.amount;
        this.price = orderData.product.price;

        //計算処理(戻り値は連想配列)を呼び出し、計算結果の項目にセット
        this.calcResults = OrdersUtil.calcValue(this.amount, this.price);
      } catch (e) {
        this.errMsg = "受注情報取得処理に失敗しました。";
        console.log(e);
      }
    },

    async ordersDelete() {
      // メッセージ初期化
      this.errMsg = "";
      this.isLoading = true;
      try {
        //削除確認用ポップアップを表示
        const confirmResult = window.confirm("本当に削除しますか?");
        //Ok(true)の場合実行
        if (confirmResult) {
          await AjaxUtil.deleteOrders(this.orderNo);
          window.alert("受注情報削除処理が完了しました。");
          this.$router.push({ name: "ordersList" });
        }
      } catch (e) {
        window.alert("受注情報削除処理に失敗しました。");
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
