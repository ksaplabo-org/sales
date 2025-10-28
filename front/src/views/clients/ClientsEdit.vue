<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">顧客情報修正</h1>
          <button
            class="btn btn-dark"
            v-on:click="
              () => {
                this.$router.push({ name: 'clientsList' });
              }
            "
          >
            顧客情報一覧画面へ
          </button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <div class="col-lg-5 mx-auto center-block mt-4">
            <!-- 顧客番号 -->
            <div class="form-group row">
              <label class="col-lg-6">顧客番号</label>
              <p v-show="clientNo" class="col-lg-6 h5">{{ clientNo }}</p>
            </div>

            <!-- 顧客名 -->
            <div class="form-group row">
              <label class="col-lg-6">顧客名<span class="text-danger">*</span></label>
              <div class="col-lg-6">
                <input
                  type="text"
                  id="clientName"
                  class="form-control"
                  placeholder="20字以内で入力してください"
                  v-model="name"
                  autocomplete="off"
                  maxlength="20"
                  minlength="1"
                />
                <div class="text-danger small" v-show="clientNameMsg">{{ clientNameMsg }}</div>
              </div>
            </div>

            <!-- 郵便番号 -->
            <div class="form-group row">
              <label class="col-lg-6">郵便番号</label>
              <div class="col-lg-6">
                <div class="d-flex flex-row">
                  <div class="col-4 px-0">
                    <input
                      type="number"
                      step="1"
                      id="postCode1"
                      class="form-control"
                      placeholder="000"
                      v-model="postCode1"
                      autocomplete="off"
                      min="000"
                      max="999"
                    />
                  </div>
                  <label class="pt-2 col-2 px-0 text-center">ー</label>
                  <div class="col-6 px-0">
                    <input
                      type="number"
                      step="1"
                      id="postCode2"
                      class="form-control"
                      placeholder="0000"
                      v-model="postCode2"
                      autocomplete="off"
                      min="0000"
                      max="9999"
                    />
                  </div>
                </div>
                <div class="text-danger small" v-show="postCodeMsg">{{ postCodeMsg }}</div>
              </div>
            </div>

            <!-- 住所１ -->
            <div class="form-group row">
              <label class="col-lg-6">住所１</label>
              <div class="col-lg-6">
                <input
                  type="text"
                  id="address1"
                  class="form-control"
                  placeholder="20字以内で入力してください"
                  v-model="address1"
                  autocomplete="off"
                  maxlength="20"
                />
                <div class="text-danger small" v-show="address1Msg">{{ address1Msg }}</div>
              </div>
            </div>

            <!-- 住所２ -->
            <div class="form-group row">
              <label class="col-lg-6">住所２</label>
              <div class="col-lg-6">
                <input
                  type="text"
                  id="address2"
                  class="form-control"
                  placeholder="20字以内で入力してください"
                  v-model="address2"
                  autocomplete="off"
                  maxlength="20"
                />
                <div class="text-danger small" v-show="address2Msg">{{ address2Msg }}</div>
              </div>
            </div>

            <!-- 電話番号 -->
            <div class="form-group row">
              <label class="col-lg-6">電話番号</label>
              <div class="col-lg-6">
                <input
                  type="tel"
                  id="telNo"
                  class="form-control"
                  placeholder="20字以内で入力してください"
                  v-model="telNo"
                  autocomplete="off"
                  maxlength="20"
                />
                <div class="text-danger small" v-show="telNoMsg">{{ telNoMsg }}</div>
              </div>
            </div>
          </div>

          <!-- 修正・キャンセルボタン -->
          <div class="form-group justify-content-center row">
            <div class="mb-3 col-lg-4">
              <btn class="btn btn-info btn-lg btn-block" v-on:click="clientsEdit()">修正</btn>
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
import CancelButton from "@/components/CancelButton.vue";
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";

import * as AjaxUtil from "@/utils/AjaxUtil";
import * as UserUtil from "@/utils/UserUtil";

export default {
  components: { CancelButton, Header, Loading },
  data() {
    return {
      errMsg: "",
      isLoading: false,
      //各項目初期値
      clientNo: "",
      name: "",
      postCode1: "",
      postCode2: "",
      address1: "",
      address2: "",
      telNo: "",
      updateId: "",
      updateDate: "",
      clientNameMsg: "",
      postCodeMsg: "",
      address1Msg: "",
      address2Msg: "",
      telNoMsg: "",
      id: "",
    };
  },
  async mounted() {
    try {
      //ログイン確認
      if (UserUtil.isLogIn()) {
        //画面更新
        await this.updateView();
      } else {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
      }
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
      this.errMsg = "";
      //クエリストリングを取得
      const query = this.$route.query;

      //ログイン中のユーザーを取得
      this.id = UserUtil.currentUserInfo().id;

      try {
        // 顧客番号から顧客情報を取得
        const response = await AjaxUtil.getClientsByClientNo(query.clientNo);
        const clientData = JSON.parse(response.data.Items);

        // 顧客情報を各項目にセット
        this.clientNo = clientData.client_no.toString().padStart(8, "0");
        this.name = clientData.name;
        this.postCode1 = clientData.post_code.substr(0, 3);
        this.postCode2 = clientData.post_code.substr(4);
        this.address1 = clientData.address1;
        this.address2 = clientData.address2;
        this.telNo = clientData.tel_no;
      } catch (e) {
        this.errMsg = "顧客情報取得処理に失敗しました。";
        console.log(e);
      }
      this.isLoading = false;
    },

    /**
     * 顧客更新
     */
    async clientsEdit() {
      // メッセージ初期化
      this.errMsg = "";
      this.clientNameMsg = "";
      this.postCodeMsg = "";
      this.address1Msg = "";
      this.address2Msg = "";
      this.telNoMsg = "";
      this.isLoading = true;
      let isErr = false;

      try {
        // 入力チェック
        if (this.name == null || this.name === "") {
          this.clientNameMsg = "顧客名が未入力です。";
          isErr = true;
        }
        if (this.name.length > 20) {
          this.clientNameMsg = "顧客名は20字以内で入力してください。";
          isErr = true;
        }
        if ((this.postCode1 || this.postCode2) && (this.postCode1.length != 3 || this.postCode2.length != 4)) {
          this.postCodeMsg = "正しい郵便番号を入力してください。";
          isErr = true;
        }
        if (this.address1.length > 20) {
          this.address1Msg = "住所１は20字以内で入力してください。";
          isErr = true;
        }
        if (this.address2.length > 20) {
          this.address2Msg = "住所２は20字以内で入力してください。";
          isErr = true;
        }
        if (this.telNo.length > 20) {
          this.telNoMsg = "電話番号は20字以内で入力してください。";
          isErr = true;
        }
        if (!this.postCode1.match("^[0-9]*$") || !this.postCode2.match("^[0-9]*$")) {
          this.postCodeMsg = "郵便番号は半角数字で入力してください。";
          isErr = true;
        }
        if (this.telNo && !this.telNo.match("^[0-9][0-9-]*$")) {
          this.telNoMsg = "電話番号は半角数字と-(半角ハイフン)のみで入力してください。";
          isErr = true;
        }
        if (isErr) {
          return;
        }
        const postCode = this.postCode1 + "-" + this.postCode2;

        // 引数格納
        const model = {
          clientNo: Number(this.clientNo),
          name: this.name,
          postCode: postCode,
          address1: this.address1,
          address2: this.address2,
          telNo: this.telNo,
          updateId: this.id,
        };

        await AjaxUtil.putClients(model);
        window.alert("顧客情報修正処理が完了しました。");
        this.$router.push({ name: "clientsList" });
      } catch (e) {
        window.alert("顧客情報修正処理に失敗しました。");
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
<!-- inputタグtype="number"のスピンボタンを消す記述 -->
<style>
input[type="number"]#postCode1::-webkit-outer-spin-button,
input[type="number"]#postCode1::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]#postCode2::-webkit-outer-spin-button,
input[type="number"]#postCode2::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
