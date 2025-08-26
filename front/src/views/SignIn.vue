<template>
  <div class="container">
    <div class="card card-login mx-auto mt-5">
      <div class="card-header text-left">サインイン</div>
      <div class="card-body text-left">
        <form @submit.stop.prevent="signIn" method="post">
          <div class="form-group">
            <div class="form-label-group">
              <input
                type="text"
                id="userId"
                class="form-control"
                placeholder="User ID"
                autofocus="autofocus"
                v-model="userId"
                autocomplete="off"
              />
              <label for="userId">ユーザーID</label>
            </div>
          </div>
          <div class="form-group">
            <div class="form-label-group">
              <input
                type="password"
                id="inputPassword"
                class="form-control"
                placeholder="Password"
                required="required"
                v-model="password"
                autocomplete="off"
                pattern="^[0-9A-Za-z]+$"
              />
              <label for="inputPassword">パスワード</label>
            </div>
          </div>
          <div class="form-group">
            <div class="form-label-group">
              <div>
                <label>
                  <span class="text-primary" v-show="msg">{{ msg }}</span>
                  <span class="text-danger" v-show="errMsg">{{ errMsg }}</span>
                </label>
              </div>
            </div>
          </div>
          <input class="btn btn-primary btn-block" type="submit" value="サインイン" />
        </form>
        <div class="text-center"></div>
      </div>
    </div>

    <!-- ローディングマスク -->
    <loading v-if="isLoading === true" />
  </div>
</template>

<script>
import * as UserUtil from "@/utils/UserUtil";
import Loading from "../components/Loading.vue";

export default {
  props: ["flashMsg", "flashErrMsg"],
  components: { Loading },
  data() {
    return {
      userId: "",
      password: "",
      errMsg: this.flashErrMsg,
      msg: this.flashMsg,
      isLoading: false,
    };
  },
  methods: {
    /**
     * サインイン処理
     */
    async signIn() {
      this.msg = "";
      this.errMsg = "";

      this.isLoading = true;

      try {
        await UserUtil.signIn(this.userId, this.password);
        this.$router.push({ name: "top" });
      } catch (e) {
        if (e.response.status === 401) {
          this.errMsg = "サインインに失敗しました";
        } else {
          this.errMsg = e.message;
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
