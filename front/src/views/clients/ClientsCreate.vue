<template>
  <div>
    <Header />
    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <h1 class="border-bottom">顧客情報登録</h1>

          <button type="button" class="btn btn-dark" v-on:click="() => $router.push({ name: 'clientsList' })">
            顧客情報一覧画面へ
          </button>
          <div class="col-lg-5 mx-auto center-block mt-4">
            <!-- 顧客番号 -->
            <div class="form-group row">
              <label for="clientNo" class="col-lg-6">顧客番号</label>
              <label class="col-lg-6 h5 newlineControl">自動で登録されます</label>
            </div>

            <!-- 顧客名 -->
            <div class="form-group row">
              <label for="name" class="col-lg-6">顧客名<span class="text-danger">*</span></label>
              <div class="col-lg-6">
                <input
                  type="text"
                  id="name"
                  class="form-control"
                  v-model="name"
                  placeholder="20字以内で入力してください"
                  autocomplete="off"
                />
                <div class="text-danger small newlineControl" v-show="nameErrMsg">{{ nameErrMsg }}</div>
              </div>
            </div>

            <!-- 郵便番号 -->
            <div class="form-group row">
              <label for="postCode" class="col-lg-6">郵便番号</label>
              <div class="col-lg-6">
                <div class="d-flex flex-row">
                  <div class="col-4 px-0">
                    <input
                      type="number"
                      id="postCode1"
                      class="form-control"
                      v-model="postCode1"
                      placeholder="000"
                      autocomplete="off"
                    />
                  </div>
                  <label class="pt-2 col-2 px-0 text-center">ー</label>

                  <div class="col-6 px-0">
                    <input
                      type="number"
                      id="postCode2"
                      class="form-control"
                      v-model="postCode2"
                      placeholder="0000"
                      autocomplete="off"
                    />
                  </div>
                </div>
                <div class="text-danger small newlineControl" v-show="postCodeErrMsg">{{ postCodeErrMsg }}</div>
              </div>
            </div>

            <!-- 住所1 -->
            <div class="form-group row">
              <label for="address1" class="col-lg-6">住所１</label>
              <div class="col-lg-6">
                <input
                  type="text"
                  id="address1"
                  class="form-control"
                  v-model="address1"
                  placeholder="20字以内で入力してください"
                  autocomplete="off"
                />
                <div class="text-danger small newlineControl" v-show="address1ErrMsg">{{ address1ErrMsg }}</div>
              </div>
            </div>

            <!-- 住所2 -->
            <div class="form-group row">
              <label for="address2" class="col-lg-6">住所２</label>
              <div class="col-lg-6">
                <input
                  type="text"
                  id="address2"
                  class="form-control"
                  v-model="address2"
                  placeholder="20字以内で入力してください"
                  autocomplete="off"
                />
                <div class="text-danger small newlineControl" v-show="address2ErrMsg">{{ address2ErrMsg }}</div>
              </div>
            </div>

            <!-- 電話番号 -->
            <div class="form-group row">
              <label for="telNo" class="col-lg-6">電話番号</label>
              <div class="col-lg-6">
                <input
                  type="text"
                  id="telNo"
                  class="form-control"
                  v-model="telNo"
                  placeholder="20字以内で入力してください"
                  autocomplete="off"
                />
                <div class="text-danger small newlineControl" v-show="telNoErrMsg">{{ telNoErrMsg }}</div>
              </div>
            </div>
          </div>

          <!-- 登録・キャンセルボタン -->
          <div class="form-group justify-content-center row">
            <div class="mb-3 col-lg-4">
              <btn class="btn btn-primary btn-lg btn-block" v-on:click="clientsCreate()">登録</btn>
            </div>
            <div class="col-lg-4">
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

<!-- 画面サイズを変更したときにエラーメッセージがテキストボックスに合わせて改行するのを防ぐ -->
<style scoped>
@media screen and (min-width: 992px) {
  .newlineControl {
    white-space: nowrap;
  }
}
</style>
