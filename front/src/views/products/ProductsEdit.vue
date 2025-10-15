<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">商品情報修正</h1>
          <button type="button" class="btn btn-dark mb-4" v-on:click="() => $router.push({ name: 'productsList' })">
            商品情報一覧画面へ
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <div class="col-lg-5 mx-auto center-block mt-4">
            <div class="form-group row">
              <label for="productCode" class="col-lg-6">商品コード</label>
              <div class="col-lg-6">
                <p v-show="productCode" class="col-lg-6 h5">{{ productCode }}</p>
              </div>
            </div>
            <div class="form-group row">
              <label for="productName" class="col-lg-6">商品名<label class="text-danger">*</label></label>
              <div class="col-lg-6">
                <input
                  type="text"
                  id="productName"
                  class="form-control"
                  v-model="productName"
                  placeholder="20字以内で入力してください"
                  autocomplete="off"
                />
                <div class="text-danger small newlineControl" v-show="productNameErrMsg">{{ productNameErrMsg }}</div>
              </div>
            </div>
            <div class="form-group row">
              <label for="price" class="col-lg-6">単価<label class="text-danger">*</label></label>
              <div class="col-lg-6">
                <input
                  type="number"
                  id="price"
                  class="form-control"
                  v-model="price"
                  placeholder="8桁以下で入力してください"
                  autocomplete="off"
                />
                <div class="text-danger small newlineControl" v-show="priceErrMsg">{{ priceErrMsg }}</div>
              </div>
            </div>
          </div>
          <!-- 修正・キャンセルボタン -->
          <div class="form-group justify-content-center row">
            <div class="mb-3 col-lg-4">
              <button type="button" class="btn btn-info btn-lg btn-block" v-on:click="productsEdit()">修正</button>
            </div>
            <div class="col-lg-4">
              <CancelButton />
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
// コンポーネント関連
import CancelButton from "@/components/CancelButton.vue";
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";

// util関連
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as UserUtil from "@/utils/UserUtil";

export default {
  components: { CancelButton, Header, Loading },
  data() {
    return {
      isLoading: false,

      //各項目初期値
      id: "",
      productCode: "",
      productName: "",
      price: "",

      //エラーメッセージ
      errMsg: "",
      productNameErrMsg: "",
      priceErrMsg: "",
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
      // 修正対象の管理用Idを設定する
      this.productCode = query.productCode;

      try {
        // 管理用Idから商品情報を取得
        const response = await AjaxUtil.getProductsByProductCode(this.productCode);

        const productData = JSON.parse(response.data.Items);

        // 商品情報を各項目にセット
        this.productCode = productData.product_code;
        this.productName = productData.product_name;
        this.price = productData.price;
      } catch (e) {
        this.errMsg = "商品情報取得処理に失敗しました。";
        console.log(e);
      }
    },

    /**
     * 受注情報更新
     */
    async productsEdit() {
      this.isLoading = true;
      // メッセージ初期化
      this.errMsg = "";
      this.productNameErrMsg = "";
      this.priceErrMsg = "";

      // エラーが1つでもあるかどうかチェックする用
      let isErr = false;

      try {
        // 入力チェック
        if (this.price == null || this.price === "") {
          this.priceErrMsg = "単価が未入力です。";
          isErr = true;
        }
        if (isNaN(this.price)) {
          this.priceErrMsg = "単価は半角数字で入力してください。";
          isErr = true;
        }

        if (!isErr && (this.price < 0 || this.price.length > 8)) {
          this.priceErrMsg = "単価は0以上8桁以内で入力してください。";
          isErr = true;
        }

        if (this.productName == null || this.productName === "") {
          this.productNameErrMsg = "商品名が未入力です。";
          isErr = true;
        }
        if (this.productName.length > 20) {
          this.productNameErrMsg = "商品名は20字以内で入力してください。";
          isErr = true;
        }

        // エラーが1つでもあった(trueの)場合、処理を終了
        if (isErr) {
          return;
        }

        // 引数格納
        const productsModel = {
          productCode: this.productCode,
          productName: this.productName,
          price: this.price,
        };

        // 商品情報修正処理
        await AjaxUtil.putProducts(productsModel);

        window.alert("商品情報修正処理が完了しました。");
        this.$router.push({ name: "productsList" });
      } catch (e) {
        window.alert("商品情報修正処理に失敗しました。");
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
<style scoped>
@media screen and (min-width: 992px) {
  .newlineControl {
    white-space: nowrap;
  }
}
</style>
