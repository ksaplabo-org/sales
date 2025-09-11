<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light vh-100">
        <div class="container-fluid">
          <h1>顧客情報修正</h1>
          <a class="btn-dark btn-lg" href="/public/pages/clients/list.html" role="button">顧客情報一覧画面へ</a>
          <br />
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

          <form @submit.stop.prevent="clientsEdit" method="post" autocomplete="new-password">
            <div class="col-5 mx-auto center-block">
              <div class="" />

              <div class="form-group d-flex flex-row">
                <label class="col">顧客番号</label>
                <p v-show="clientNo" class="col-7 h5 pl-0">{{ clientNo }}</p>
              </div>
              <!-- 顧客名 -->
              <div class="form-group d-flex flex-row">
                <label class="col">顧客名<label class="text-danger">*</label></label>
                <input
                  type="text"
                  id="clientName"
                  class="form-control col-7"
                  placeholder="20字以内で入力してください"
                  v-model="name"
                  autocomplete="off"
                  maxlength="20"
                  minlength="1"
                />
              </div>
              <div class="text-danger col text-right pr-0 mb-3" v-show="clientNameMsg">{{ clientNameMsg }}</div>
              <!-- 郵便番号 -->
              <div class="form-group d-flex flex-row">
                <label class="col">郵便番号</label>
                <input
                  type="tel"
                  id="postCode1"
                  class="form-control col-3"
                  placeholder="000"
                  v-model="postCode1"
                  autocomplete
                  maxlength="3"
                  inputmode="numeric"
                />
                <label class="pt-2 col-1 text-center">ー</label>
                <input
                  type="tel"
                  id="postCode2"
                  class="form-control col-3"
                  placeholder="0000"
                  v-model="postCode2"
                  autocomplete
                  maxlength="4"
                  inputmode="numeric"
                />
              </div>
              <div class="text-danger col text-right pr-0 mb-3" v-show="postCodeMsg">{{ postCodeMsg }}</div>
              <!-- 住所１ -->
              <div class="form-group d-flex flex-row">
                <label class="col">住所１</label>
                <input
                  type="text"
                  id="clientsName"
                  class="form-control col-7"
                  placeholder="20字以内で入力してください"
                  v-model="address1"
                  autocomplete="off"
                  maxlength="20"
                />
              </div>
              <div class="text-danger col text-right pr-0 mb-3" v-show="address1Msg">{{ address1Msg }}</div>

              <!-- 住所２ -->
              <div class="form-group d-flex flex-row">
                <label class="col">住所２</label>
                <input
                  type="text"
                  id="clientsName"
                  class="form-control col-7"
                  placeholder="20字以内で入力してください"
                  v-model="address2"
                  autocomplete="off"
                  maxlength="20"
                />
              </div>
              <div class="text-danger col text-right pr-0 mb-3" v-show="address2Msg">{{ address2Msg }}</div>

              <!-- 電話番号 -->
              <div class="form-group d-flex flex-row">
                <label class="col">電話番号</label>
                <input
                  type="tel"
                  id="telNo"
                  class="form-control col-7"
                  placeholder="20字以内で入力してください"
                  v-model="telNo"
                  autocomplete
                  maxlength="20"
                />
              </div>
              <div class="text-danger col text-right pr-0 mb-3" v-show="telNoMsg">{{ telNoMsg }}</div>
            </div>
            <!-- 修正・キャンセルボタン -->
            <div class="form-group d-flex justify-content-center col">
              <div class="col-2">
                <input class="btn btn-primary btn-lg btn-block" type="submit" value="修正" />
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
import UserConst from "@/utils/const/UserConst";
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
      isErr: false,
    };
  },
  async mounted() {
    try {
      //ログイン確認
      if (UserUtil.isLogIn()) {
        //画面更新
        await this.updateView();
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
     * 画面更新
     */
    updateView: async function () {
      this.isLoading = true;

      //クエリストリングを取得
      const query = this.$route.query;
      //編集対象の顧客番号を設定する
      this.clientNo = query.clientNo;
      //ログイン中のユーザーを取得
      this.id = UserUtil.currentUserInfo().id;

      try {
        // 顧客番号から顧客情報を取得
        const response = await AjaxUtil.getClientsByClientNo(this.clientNo);
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
        this.errMsg = "顧客情報取得に失敗しました";
        console.log(e);
      }
      this.isLoading = false;
    },

    /**
     * ユーザー更新
     */
    clientsEdit: async function () {
      // メッセージ初期化
      this.errMsg = "";
      this.clientNameMsg = "";
      this.postCodeMsg = "";
      this.address1Msg = "";
      this.address2Msg = "";
      this.telNoMsg = "";
      this.id;
      this.isLoading = true;
      this.isErr = false;

      try {
        // 入力チェック
        if (this.name == null || this.name === "") {
          this.clientNameMsg = "顧客名が未入力です。";
          this.isErr = true;
        }
        if (this.name.length > 20) {
          this.clientNameMsg = "顧客名は20字以内で入力してください。";
          this.isErr = true;
        }
        if ((this.postCode1 || this.postCode2) && (this.postCode1.length != 3 || this.postCode2.length != 4)) {
          this.postCodeMsg = "正しい郵便番号を入力してください。";
          this.isErr = true;
        }
        if (this.address1.length > 20) {
          this.address1Msg = "住所１は20字以内で入力してください。";
          this.isErr = true;
        }
        if (this.address2.length > 20) {
          this.address2Msg = "住所２は20字以内で入力してください。";
          this.isErr = true;
        }
        if (this.telNo.length > 20) {
          this.telNoMsg = "電話番号は20字以内で入力してください。";
          this.isErr = true;
        }
        if (!this.postCode1.match("^[0-9]*$") || !this.postCode2.match("^[0-9]*$")) {
          this.postCodeMsg = "郵便番号は半角数字で入力してください。";
          this.isErr = true;
        }
        if (this.telNo && !this.telNo.match("^[0-9][0-9-]*$")) {
          this.telNoMsg = "電話番号は半角数字と-(半角ハイフン)のみで入力してください。";
          this.isErr = true;
        }
        if (this.isErr) {
          return;
        }
        this.postCode = this.postCode1 + "-" + this.postCode2;
        // 引数格納

        const model = {
          clientNo: this.clientNo,
          name: this.name,
          postCode: this.postCode,
          address1: this.address1,
          address2: this.address2,
          telNo: this.telNo,
          updateId: this.id,
        };

        console.log(model);
        await AjaxUtil.putClients(model);
        window.alert("顧客情報修正処理が完了しました。");
        window.location.href = "/public/pages/clients/list.html";
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
