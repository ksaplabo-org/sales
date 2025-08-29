<template>
  <div>
    <>

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light">
        <div class="container-fluid">
          <h1>顧客情報修正</h1>
          <a class="btn-dark btn-lg" href="/public/pages/clients/list.html" role="button">顧客情報一覧へ</a>
          <p class="text-primary" v-show="msg">{{ msg }}</p>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

          <form @submit.stop.prevent="clientsEdit" method="post" autocomplete="new-password">
            <div class="col-5 mx-auto center-block">
              <div class="" />

              <div class="form-group">
                <label class="col">顧客番号</label>
                <p class="col"></p>
              </div>
              <!-- 顧客名 -->
              <div class="form-group d-flex flex-row">
                <label class="col">顧客名</label>
                <input
                  type="text"
                  id="clientsName"
                  class="form-control col-5"
                  placeholder="20字以内で入力してください"
                  v-model="name"
                  autocomplete="off"
                  maxlength="20"
                  minlength="1"
                />
              </div>
              <!-- 郵便番号 -->
              <div class="form-group d-flex flex-row">
                <label class="col">郵便番号</label>
                <input
                  type="tel"
                  id="postCode1"
                  class="form-control mr-2 col-1"
                  placeholder="000"
                  v-model="postCode1"
                  autocomplete
                  maxlength="3"
                />
                <label class="pt-2">ー</label>
                <input
                  type="tel"
                  id="postCode2"
                  class="form-control w-auto ml-2 col-1"
                  placeholder="0000"
                  v-model="postCode2"
                  autocomplete
                  maxlength="4"
                />
              </div>

              <!-- 住所１ -->
              <div class="form-group d-flex flex-row">
                <label class="col">住所１</label>
                <input
                  type="text"
                  id="clientsName"
                  class="form-control col-5"
                  placeholder="20字以内で入力してください"
                  v-model="address1"
                  autocomplete="off"
                  maxlength="20"
                />
              </div>

              <!-- 住所２ -->
              <div class="form-group d-flex flex-row">
                <label class="col">住所２</label>
                <input
                  type="text"
                  id="clientsName"
                  class="form-control col-5"
                  placeholder="20字以内で入力してください"
                  v-model="address2"
                  autocomplete="off"
                  maxlength="20"
                />
              </div>

              <!-- 電話番号 -->
              <div class="form-group d-flex flex-row">
                <label class="col">電話番号</label>
                <input
                  type="tel"
                  id="telNo"
                  class="form-control col-5"
                  placeholder="20字以内で入力してください"
                  v-model="telNo"
                  autocomplete
                  maxlength="20"
                />
              </div>
            </div>
            <!-- 更新・削除ボタン -->
            <div class="form-group d-flex justify-content-center">
              <div class="p-2 w-25">
                <input class="btn btn-primary btn-block" type="submit" value="修正" />
              </div>
              <div class="p-2 w-25">
                <b-button class="btn-secondary btn-block" data-toggle="modal" data-target="#deleteConfirmModal"
                  >取消</b-button
                >
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
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";
import UserConst from "@/utils/const/UserConst";
// 共通
import Header from "../../components/Header.vue";
import "../../utils/sb-admin";
import Loading from "../../components/Loading.vue";
export default {
  props: ["flashMsg", "flashErrMsg"],
  components: { Header, Loading },
  data() {
    return {
      msg: "",
      errMsg: "",
      isLoading: false,
      //各項目初期値
      name:"",
      postCode:"",
      postCode1:"",
      postCode2:"",
      address1:"",
      address2:"",
      telNo:"",
      updateId:"",
      updateDate:"",
    };
  },
  async moutnted() {
    try {
      //ログイン確認

      //画面更新
      await this.updateView();
    } catch (e) {}
  },
  methods: {
    /**
     * 画面更新
     */
    updateView: async function () {
      this.isLoading = true;

      try {
        // 顧客番号から顧客情報を取得
        const response = await AjaxUtil.getUserById(this.clientNo);
        const userInfo = JSON.parse(response.data.Items);

        // ユーザー情報を各項目にセット
        this.name = userInfo.user_name;
        this.password = userInfo.password;
        this.gender = userInfo.gender;
        this.auth = userInfo.auth;
        this.address = userInfo.address;
      } catch (e) {
        this.msg = "";
        this.errMsg = "ユーザー取得に失敗しました";
        console.log(e);
      }
      this.isLoading = false;
    },

    /**
     * ユーザー更新
     */
    userUpdate: async function () {
      // メッセージ初期化
      this.msg = "";
      this.errMsg = "";

      this.isLoading = true;

      try {
        // 入力チェック
        if (this.name == null || this.name === "") {
          this.errMsg = "顧客名が未入力です。";
        }
        if (this.name.length > 20) {
          this.errMsg = "顧客名は20字以内で入力してください。";
        }
        if (this.postCode1.length != 3 || this.postCode2 !=4) {
          this.errMsg = "正しい郵便番号を入力してください。";
        }
        if (this.address1.length > 20) {
          this.errMsg = "住所１は20字以内で入力してください。";
        }
        if (this.address2.length > 20) {
          this.errMsg = "住所２は20字以内で入力してください。";
        }
        if (this.telNo.length > 20) {
          this.errMsg = "電話番号は20字以内で入力してください。";
        }
        if (!this.postCode1.match("^[0-9]*$")||!this.postCode2.match("^[0-9]*$")) {
          this.errMsg = "郵便番号は半角数字で入力してください。";
        }
        if (!this.telNo.match("^[0-9][0-9-]*$")) {
          this.errMsg = "電話番号は半角数字と-(半角ハイフン)のみで入力してください。";
          return;
        }
       

        // 引数格納
        const model = {
          clientNo: this.clientNo,
          name: this.name,
          postCode: this.postCode,
          address1: this.address1,
          address2: this.address2,
          telNo: this.telno,
        };

        await AjaxUtil.putClients(model);
        this.msg = "ユーザー更新に成功しました";
        document.getElementById("reInputPassword").disabled = true;
        isPassChange = false;
      } catch (e) {
        this.msg = "";
        this.errMsg = "ユーザー更新に失敗しました";
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
