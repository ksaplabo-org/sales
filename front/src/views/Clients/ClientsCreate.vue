<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light">
        <div>
          <h1>顧客情報登録</h1>
        </div>

        <div class="container-fluid">
          <button type="button" class="btn btn-dark" v-on:click="() => $router.push({ name: 'clientsList' })">
            受注情報一覧画面へ
          </button>
          <br />

          <form @submit.stop.prevent="clientsCreate" method="post">
            <div class="d-flex flex-row">
              <div class="col-3"></div>
              <div class="col-1">顧客番号</div>
              <div class="col-4">自動で登録されます</div>
            </div>
            <div class="d-flex flex-row">
              <div class="col-3"></div>
              <div class="col-1">
                <div class="d-flex flex-row">
                  <div class="text" style="color: red">*</div>
                  <div class="text">顧客名</div>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <input
                    type="text"
                    id="name"
                    class="form-control"
                    placeholder="20字以内で入力してください"
                    v-model="name"
                    autocomplete="off"
                  />
                </div>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="col-4"></div>
              <div class="col-4">
                <p class="text-danger" v-show="nameErrMsg">{{ nameErrMsg }}</p>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="col-3"></div>
              <div class="col-1">郵便番号</div>
              <div class="col-1">
                <div class="form-group">
                  <input
                    type="number"
                    id="postCode1"
                    class="form-control"
                    placeholder="000"
                    v-model="postCode1"
                    autocomplete="off"
                  />
                </div>
              </div>
              <div class="text" style="display: inline-block; vertical-align: middle">ー</div>
              <div class="col-1">
                <div class="form-group">
                  <input
                    type="number"
                    id="postCode2"
                    class="form-control"
                    placeholder="0000"
                    v-model="postCode2"
                    autocomplete="off"
                  />
                </div>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="col-4"></div>
              <div class="col-4">
                <p class="text-danger" v-show="postCodeErrMsg">{{ postCodeErrMsg }}</p>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="col-3"></div>
              <div class="col-1">住所1</div>
              <div class="col-4">
                <div class="form-group">
                  <input
                    type="text"
                    id="address1"
                    class="form-control"
                    placeholder="20字以内で入力してください"
                    v-model="address1"
                    autocomplete="off"
                  />
                </div>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="col-4"></div>
              <div class="col-4">
                <p class="text-danger" v-show="address1ErrMsg">{{ address1ErrMsg }}</p>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="col-3"></div>
              <div class="col-1">住所2</div>
              <div class="col-4">
                <div class="form-group">
                  <input
                    type="text"
                    id="address2"
                    class="form-control"
                    placeholder="20字以内で入力してください"
                    v-model="address2"
                    autocomplete="off"
                  />
                </div>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="col-4"></div>
              <div class="col-5">
                <p class="text-danger" v-show="address2ErrMsg">{{ address2ErrMsg }}</p>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="col-3"></div>
              <div class="col-1">電話番号</div>
              <div class="col-4">
                <div class="form-group">
                  <input
                    type="text"
                    id="telNo"
                    class="form-control"
                    placeholder="20字以内で入力してください"
                    v-model="telNo"
                    autocomplete="off"
                  />
                </div>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="col-4"></div>
              <div class="col-5">
                <p class="text-danger" v-show="telNoErrMsg">{{ telNoErrMsg }}</p>
              </div>
            </div>
          </form>
          <div class="d-flex flex-row">
            <div class="col-4"></div>
            <div class="col-2">
              <button
                type="button"
                class="btn btn-primary btn-lg btn-block"
                v-on:click="clientsCreate()"
                style="padding: auto"
              >
                登録
              </button>
            </div>
            <CancelButton />
          </div>
        </div>
      </div>
    </div>
    <!-- トップにスクロール -->
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
// 共通

import "@/utils/sb-admin";

import Loading from "@/components/Loading.vue";
import Header from "@/components/Header.vue";
import CancelButton from "@/components/CancelButton.vue";
export default {
  props: ["flashMsg", "flashErrMsg"],
  components: { Header, Loading, CancelButton },
  data() {
    return {
      msg: "",
      errMsg: "",
      nameErrMsg: "",
      postCodeErrMsg: "",
      address1ErrMsg: "",
      address2ErrMsg: "",
      telNoErrMsg: "",
      isLoading: false,
      // 各項目初期値
      name: "",
      postCode1: "",
      postCode2: "",
      address1: "",
      address2: "",
      telNo: "",

      postCode: "",
      errFlag: false,
    };
  },
  async mounted() {
    try {
      if (UserUtil.isLogIn()) {
        this.msg = this.flashMsg;
        this.errMsg = this.flashErrMsg;
        this.nameErrMsg = "";
        this.postCodeErrMsg = "";
        this.address1ErrMsg = "";
        this.address2ErrMsg = "";
        this.telNoErrMsg = "";
        this.errFlag = false;
      } else {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
      }
    } catch (e) {
      this.errMsg = e.message;
    }
  },
  methods: {
    /**
     * ユーザー作成
     */
    clientsCreate: async function () {
      this.isLoading = true;
      this.nameErrMsg = "";
      this.postCodeErrMsg = "";
      this.address1ErrMsg = "";
      this.address2ErrMsg = "";
      this.telNoErrMsg = "";
      this.errFlag = false;
      try {
        if (this.name == null || this.name === "") {
          this.nameErrMsg = "顧客名を入力してください。";
          this.errFlag = true;
        }
        if (this.name.length > 20) {
          this.nameErrMsg = "顧客名は20字以下で入力してください。";
          this.errFlag = true;
        }
        if (
          (!(this.postCode1 == null || this.postCode1 === "") || !(this.postCode2 == null || this.postCode2 === "")) &&
          (this.postCode1.toString().length != 3 || this.postCode2.toString().length != 4)
        ) {
          this.postCodeErrMsg = "正しい郵便番号を入力してください。";
          this.errFlag = true;
        }
        if (this.address1.length > 20) {
          this.address1ErrMsg = "住所１は20字以下で入力してください。";
          this.errFlag = true;
        }
        if (this.address2.length > 20) {
          this.address2ErrMsg = "住所２は20字以下で入力してください。";
          this.errFlag = true;
        }
        if (this.telNo.length > 20) {
          this.telNoErrMsg = "電話番号は20字以下で入力してください。";
          this.errFlag = true;
        }
        if (!this.postCode1.match("^[0-9]*$") || !this.postCode2.match("^[0-9]*$")) {
          this.postCodeErrMsg = "郵便番号は半角英数で入力してください。";
          this.errFlag = true;
        }
        if (this.telNo != null && this.telNo !== "" && !this.telNo.match("^[0-9][0-9-]*$")) {
          this.telNoErrMsg = "電話番号は半角数字と-(半角ハイフン)のみで入力してください。";
          this.errFlag = true;
        }
        if (this.errFlag) {
          return;
        }
        if (!(this.postCode1 == null || this.postCode1 === "") && !(this.postCode2 == null || this.postCode2 === "")) {
          this.postCode = this.postCode1.toString() + "-" + this.postCode2.toString();
        }

        const clientsModel = {
          name: this.name,
          postCode: this.postCode,
          address1: this.address1,
          address2: this.address2,
          telNo: this.telNo,
        };
        console.log(clientsModel);
        // 登録
        await AjaxUtil.postClients(clientsModel);
        alert("顧客情報登録処理が完了しました。");
        // 一覧画面に遷移する
        this.$router.push({ name: "clientsList" });
      } catch (e) {
        this.msg = "";
        alert("顧客情報登録に失敗しました。");
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
