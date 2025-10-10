<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">商品情報登録</h1>
          <button type="button" class="btn btn-dark mb-4" v-on:click="() => $router.push({ name: 'productsList' })">
            商品情報一覧画面へ
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <div class="col-lg-5 mx-auto center-block mt-4">
            <!-- 商品コード -->
            <div class="form-group row">
              <label class="col-lg-6">商品コード</label>
              <div class="col-lg-6">
                <p class="h5">自動で登録されます</p>
              </div>
            </div>

            <!-- 商品名 -->
            <div class="form-group row">
              <label for="productName" class="col-lg-6">商品名<span class="text-danger">*</span></label>
              <div class="col-lg-6">
                <input
                  id="productName"
                  placeholder="20字以内で入力してください"
                  v-model="productName"
                  class="form-control h5"
                />
                <!-- 商品名エラーメッセージ -->
                <div class="text-danger small" v-show="productNameErrMsg">
                  {{ productNameErrMsg }}
                </div>
              </div>
            </div>

            <!-- 単価 -->
            <div class="form-group row">
              <label for="price" class="col-lg-6">単価<span class="text-danger">*</span></label>
              <div class="col-lg-6">
                <input
                  id="price"
                  type="number"
                  placeholder="8桁以内で入力してください"
                  v-model="price"
                  class="form-control h5"
                />
                <!-- 単価エラーメッセージ -->
                <div class="text-danger small" v-show="priceErrMsg">{{ priceErrMsg }}</div>
              </div>
            </div>
          </div>
          <!-- 登録・キャンセルボタン -->
          <div class="form-group justify-content-center row">
            <div class="mb-3 col-lg-4">
              <btn class="btn btn-primary btn-lg btn-block" v-on:click="productsCreate()">登録</btn>
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
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
import CancelButton from "@/components/CancelButton.vue";

// util関連
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";
export default {
  components: { Header, Loading, CancelButton },
  data() {
    return {
      // ローディング設定
      isLoading: false,

      //各項目初期値
      productName: "",
      price: "",

      //エラーメッセージ
      errMsg: "",
      productNameErrMsg: "",
      priceErrMsg: "",
    };
  },
  async mounted() {
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
      }
    } catch (e) {
      this.errMsg = e.message;
    }
  },
  methods: {
    async productsCreate() {
      this.isLoading = true;

      //   エラーメッセージ初期化
      this.productNameErrMsg = "";
      this.priceErrMsg = "";

      let errFlag = false;

      try {
        // 商品名入力チェック
        if (this.productName == null || this.productName === "") {
          this.productNameErrMsg = "商品名が未入力です。";
          errFlag = true;
        } else if (String(this.productName).length > 20) {
          this.productNameErrMsg = "商品名は20字以内で入力してください。";
          errFlag = true;
        }

        // 単価入力チェック
        if (this.price == null || this.price === "") {
          this.priceErrMsg = "単価が未入力です。";
          errFlag = true;
        } else if (isNaN(this.price)) {
          this.priceErrMsg = "単価は半角数字で入力してください。";
          errFlag = true;
        } else if (Number(this.price) < 0 || String(this.price).length > 8) {
          this.priceErrMsg = "単価は0以上8桁以内で入力してください。";
          errFlag = true;
        }

        if (errFlag) {
          return;
        }

        const productModel = {
          productName: this.productName,
          price: this.price,
        };
        // 登録
        await AjaxUtil.postProducts(productModel);
        alert("商品情報登録処理が完了しました。");
        // 一覧画面に遷移する
        this.$router.push({ name: "productsList" });
      } catch (e) {
        if (e.response.status === 400) {
          this.msg = "";
          alert("商品情報の登録上限を超えています。");
          console.log(e);
          this.$router.push({ name: "productsList" });
        } else {
          this.msg = "";
          alert("商品情報登録に失敗しました。");
          console.log(e);
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
