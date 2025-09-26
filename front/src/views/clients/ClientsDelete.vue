<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">顧客情報削除</h1>
          <button class="btn btn-dark" v-on:click="() => $router.push({ name: 'clientsList' })">
            顧客情報一覧画面へ
          </button>
          <br />
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

          <form @submit.stop.prevent="clientsDelete" method="post" autocomplete="new-password">
            <div class="col-sm-5 mx-auto center-block">
              <div class="" />

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
                <p class="col-sm-6 h5">{{ postCode }}</p>
              </div>

              <!-- 住所１ -->
              <div class="form-group row">
                <label class="col-sm-6">住所１</label>
                <p v-show="address1" class="col-sm-6 h5">{{ address1 }}</p>
              </div>

              <!-- 住所２ -->
              <div class="form-group row">
                <label class="col-sm-6">住所２</label>
                <p v-show="address2" class="col-sm-6 h5">{{ address2 }}</p>
              </div>

              <!-- 電話番号 -->
              <div class="form-group row">
                <label class="col-sm-6">電話番号</label>
                <p v-show="telNo" class="col-sm-6 h5">{{ telNo }}</p>
              </div>
            </div>

            <!-- 削除ボタン -->
            <div class="form-group justify-content-center row">
              <div class="col-sm-6">
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

// コンポーネント関連
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
//utils関連
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as UserUtil from "@/utils/UserUtil";
import UserConst from "@/utils/const/UserConst";

export default {
  components: { Header, Loading },
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
      telNo: "",
    };
  },
  async mounted() {
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });

        //権限チェック(管理者以外拒否)
      } else if (UserUtil.currentUserInfo().userRole != UserConst.UserRole.admin) {
        this.$router.push({ name: "logIn", params: { flashMsg: "権限がありません。" } });
      }

      // メッセージ設定
      this.errMsg = "";

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
      //削除対象の顧客番号を設定する
      this.clientNo = query.clientNo;

      try {
        // 顧客番号から顧客情報を取得
        const response = await AjaxUtil.getClientsByClientNo(this.clientNo);
        const clientData = JSON.parse(response.data.Items);

        // 顧客情報を各項目にセット
        // 表示用の0埋め処理
        this.clientNo = clientData.client_no.toString().padStart(8, "0");
        this.name = clientData.name;
        this.postCode = clientData.post_code;
        this.address1 = clientData.address1;
        this.address2 = clientData.address2;
        this.telNo = clientData.tel_no;
      } catch (e) {
        this.errMsg = "顧客情報取得に失敗しました。";
        console.log(e);
      }
      this.isLoading = false;
    },

    /**
     * 顧客情報削除
     */
    async clientsDelete() {
      // メッセージ初期化
      this.errMsg = "";
      this.isLoading = true;
      try {
        //削除確認用ポップアップを表示
        const confirmResult = window.confirm("本当に削除しますか?");
        //Ok(true)の場合実行
        if (confirmResult) {
          await AjaxUtil.deleteClients(this.clientNo);
          window.alert("顧客情報削除処理が完了しました。");
          this.$router.push({ name: "clientsList" });
        }
      } catch (e) {
        
     
          window.alert("顧客情報削除処理に失敗しました。");
          console.log(e);
        
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
