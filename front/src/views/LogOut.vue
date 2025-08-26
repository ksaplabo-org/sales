<template>
  <div>
    <h1>サインアウト</h1>
    <loading v-if="isLoading === true" />
    <p>Please wait......</p>
  </div>
</template>

<script>
import * as UserUtil from "@/utils/UserUtil";
import Loading from "../components/Loading.vue";

export default {
  props: ["flashMsg"],
  components: { Loading },
  data() {
    return {
      msg: this.flashMsg,
      isLoading: false,
    };
  },
  async mounted() {
    try {
      this.isLoading = true;

      await UserUtil.signOut();

      this.isLoading = false;
      this.$router.push({ name: "signIn", params: { flashMsg: "サインアウトしました" } });
    } catch (e) {
      this.isLoading = false;
      this.msg = e.message;
      this.$router.push({ name: "signIn", params: { flashErrMsg: "サインアウト中にエラーが発生しました" } });
    }
  },
};
</script>
