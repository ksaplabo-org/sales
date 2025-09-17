<template>
  <div>
    <Header />

    <div id="content-wrapper" class="bg-light min-vh-100">
      <div class="container-fluid">
        <h1 class="border-bottom">顧客情報登録</h1>

        <button type="button" class="btn btn-dark" v-on:click="() => $router.push({ name: 'clientsList' })">
          顧客情報一覧画面へ
        </button>
        <br />
        <div class="row" style="margin: 15px; padding-bottom: 15px">
          <div class="col-lg-3"></div>
          <div class="col-lg-2 h5" style="height: 30px">顧客番号</div>
          <div class="col-lg-3 h5">自動で登録されます</div>
        </div>
        <div class="row" style="margin: 15px">
          <div class="col-lg-3"></div>
          <label class="col-lg-2 h5">顧客名<label class="text-danger" style="margin-bottom: 0px">*</label></label>
          <div class="col-lg-3" style="margin-bottom: 0px">
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
        <div class="row" style="margin: 0px 15px 0px 15px">
          <div class="col-lg-5"></div>
          <div class="col-lg-6">
            <p class="text-danger" v-show="nameErrMsg">{{ nameErrMsg }}</p>
          </div>
        </div>
        <div class="row" style="margin: 15px">
          <div class="col-lg-3"></div>
          <div class="col-lg-2 h5">郵便番号</div>
          <div class="col-lg-3 d-flex flex-row">
            <div class="col-lg-5" style="margin-bottom: 0px; padding-left: 0px">
              <input
                type="number"
                id="postCode1"
                class="form-control"
                placeholder="000"
                v-model="postCode1"
                autocomplete="off"
              />
            </div>
            <div class="text col-lg-1" style="display: inline-block; vertical-align: middle">ー</div>
            <div class="col-lg-6" style="margin-bottom: 0px">
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
        <div class="row" style="margin: 0px 15px 0px 15px">
          <div class="col-lg-5"></div>
          <div class="col-lg-6">
            <p class="text-danger" v-show="postCodeErrMsg">{{ postCodeErrMsg }}</p>
          </div>
        </div>
        <div class="row" style="margin: 15px">
          <div class="col-lg-3"></div>
          <div class="col-lg-2 h5">住所1</div>
          <div class="col-lg-3" style="margin-bottom: 0px">
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
        <div class="row" style="margin: 0px 15px 0px 15px">
          <div class="col-lg-5"></div>
          <div class="col-lg-6">
            <p class="text-danger" v-show="address1ErrMsg">{{ address1ErrMsg }}</p>
          </div>
        </div>
        <div class="row" style="margin: 15px">
          <div class="col-lg-3"></div>

          <div class="col-lg-2 h5">住所2</div>
          <div class="col-lg-3" style="margin-bottom: 0px">
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
        <div class="row" style="margin: 0px 15px 0px 15px">
          <div class="col-lg-5"></div>
          <div class="col-lg-6">
            <p class="text-danger" v-show="address2ErrMsg">{{ address2ErrMsg }}</p>
          </div>
        </div>
        <div class="row" style="margin: 15px">
          <div class="col-lg-3"></div>
          <div class="col-lg-2 h5">電話番号</div>
          <div class="col-lg-3" style="margin-bottom: 0px">
            <input
              type="tel"
              id="telNo"
              class="form-control"
              placeholder="20字以内で入力してください"
              v-model="telNo"
              autocomplete="off"
            />
          </div>
        </div>
        <div class="row" style="margin: 0px 15px 0px 15px">
          <div class="col-lg-5"></div>
          <div class="col-lg-6">
            <p class="text-danger" v-show="telNoErrMsg">{{ telNoErrMsg }}</p>
          </div>
        </div>
        <div class="row justify-content-center" style="margin: 15px">
          <div class="col-lg-4">
            <button
              type="button"
              class="btn btn-primary btn-lg btn-block"
              v-on:click="clientsCreate()"
              style="margin: 15px"
            >
              登録
            </button>
          </div>
          <div class="col-lg-4">
            <CancelButton style="margin: 15px" />
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
      name: "",
      postCode1: "",
      postCode2: "",
      address1: "",
      address2: "",
      telNo: "",
    };
  },
  mounted() {
    if (UserUtil.isLogIn()) {
      this.msg = this.flashMsg;
      this.errMsg = this.flashErrMsg;
      this.nameErrMsg = "";
      this.postCodeErrMsg = "";
      this.address1ErrMsg = "";
      this.address2ErrMsg = "";
      this.telNoErrMsg = "";
    } else {
      this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
    }
  },
  methods: {
    async clientsCreate() {
      this.msg = "";
      this.isLoading = true;
      this.nameErrMsg = "";
      this.postCodeErrMsg = "";
      this.address1ErrMsg = "";
      this.address2ErrMsg = "";
      this.telNoErrMsg = "";
      let errFlag = false;
      let postCode = "";
      try {
        if (this.name == null || this.name === "") {
          this.nameErrMsg = "顧客名が未入力です。";
          errFlag = true;
        }
        if (this.name.length > 20) {
          this.nameErrMsg = "顧客名は20字以下で入力してください。";
          errFlag = true;
        }
        if ((this.postCode1 || this.postCode2) && (this.postCode1.length != 3 || this.postCode2.length != 4)) {
          this.postCodeErrMsg = "正しい郵便番号を入力してください。";
          errFlag = true;
        }
        if (this.address1.length > 20) {
          this.address1ErrMsg = "住所１は20字以内で入力してください。";
          errFlag = true;
        }
        if (this.address2.length > 20) {
          this.address2ErrMsg = "住所２は20字以内で入力してください。";
          errFlag = true;
        }
        if (this.telNo.length > 20) {
          this.telNoErrMsg = "電話番号は20字以内で入力してください。";
          errFlag = true;
        }
        if (!this.postCode1.match("^[0-9]*$") || !this.postCode2.match("^[0-9]*$")) {
          this.postCodeErrMsg = "郵便番号は半角数字で入力してください。";
          errFlag = true;
        }
        if (this.telNo != null && this.telNo !== "" && !this.telNo.match("^[0-9][0-9-]*$")) {
          this.telNoErrMsg = "電話番号は半角数字と-(半角ハイフン)のみで入力してください。";
          errFlag = true;
        }
        if (errFlag) {
          return;
        }
        if (this.postCode1 && this.postCode2) {
          postCode = this.postCode1.toString() + "-" + this.postCode2.toString();
        }

        const clientsModel = {
          name: this.name,
          postCode: postCode,
          address1: this.address1,
          address2: this.address2,
          telNo: this.telNo,
        };
        // 登録
        await AjaxUtil.postClients(clientsModel);
        alert("顧客情報登録処理が完了しました。");
        // 一覧画面に遷移する
        this.$router.push({ name: "clientsList" });
      } catch (e) {
        if (e.response.status === 400) {
          alert("顧客情報の登録上限を超えています。");
          this.$router.push({ name: "clientsList" });
        } else {
          alert("顧客情報登録に失敗しました。");
        }
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
