<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">商品情報削除</h1>
          <button class="btn btn-dark" v-on:click="() => $router.push({ name: 'productsList' })">
            商品情報一覧画面へ
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <form @submit.stop.prevent="productsDelete" method="post">
            <div class="col-lg-5 mx-auto center-block mt-4">
              <!-- 商品コード -->
              <div class="form-group row">
                <label class="col-lg-6">商品コード</label>
                <p v-show="productCode" class="col-lg-6 h5">{{ productCode }}</p>
              </div>

              <!-- 商品名 -->
              <div class="form-group row">
                <label class="col-lg-6">商品名</label>
                <p v-show="productName" class="col-lg-6 h5">{{ productName }}</p>
              </div>

              <!-- 単価 -->
              <div class="form-group row">
                <label class="col-lg-6">単価</label>
                <p v-show="price" class="col-lg-6 h5">{{ price }}</p>
              </div>
            </div>

            <!-- 削除ボタン -->
            <div class="form-group justify-content-center row">
              <div class="mb-3 col-lg-6">
                <input class="btn btn-danger btn-sm btn-block" type="submit" value="削除" />
              </div>
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
// 共通
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";

import * as AjaxUtil from "@/utils/AjaxUtil";
import * as UserUtil from "@/utils/UserUtil";

export default {
  components: { Header, Loading },
  data() {
    return {
      //各項目初期値
      errMsg: "",
      productCode: "",
      productName: "",
      price: "",
      isLoading: false,
    };
  },
  async mounted() {
    try {
      this.userInfo = UserUtil.currentUserInfo();
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
      }

      //画面更新処理
      await this.updateView();
    } catch (e) {
      this.errMsg = e.message;
    }
  },
  methods: {
    /**
     * 画面更新
     */
    async updateView() {
      this.isLoading = true;

      //クエリストリングを取得
      const query = this.$route.query;
      //削除対象の商品コードを設定する
      this.productCode = query.productCode;

      try {
        // 商品コードから商品情報を取得
        const response = await AjaxUtil.getProductsByProductCode(this.productCode);
        const productData = JSON.parse(response.data.Items);

        // 商品情報を各項目にセット
        this.productCode = productData.product_code;
        this.productName = productData.product_name;
        this.price = productData.price;
      } catch (e) {
        this.errMsg = "商品情報取得に失敗しました。";
        console.log(e);
      }
      this.isLoading = false;
    },

    /**
     * 商品情報削除
     */
    async productsDelete() {
      // メッセージ初期化
      this.errMsg = "";
      this.isLoading = true;
      try {
        //削除確認用ポップアップを表示
        const confirmResult = window.confirm("本当に削除しますか?");
        //Ok(true)の場合実行
        if (confirmResult) {
          await AjaxUtil.deleteProducts(this.productCode);
          window.alert("商品情報削除処理が完了しました。");
          this.$router.push({ name: "productsList" });
        }
      } catch (e) {
        if (e.response.status === 409) {
          window.alert("受注情報に登録されている商品のため、削除できません。");
        } else {
          window.alert("商品情報削除処理に失敗しました。");
        }
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
