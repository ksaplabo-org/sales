<template>
  <BContainer fluid class="flex-grow-1 bg-light">
    Content
  </BContainer>

  <!-- ローディングマスク -->
  <loading v-if="isLoading === true" />
</template>

<script>
import * as Auth from "@/utils/auth.js";
//import * as AjaxUtil from "@/utils/AjaxUtil";

// 共通
import NaviMenu from "@/components/NaviMenu.vue";
import Menu from "@/components/Menu.vue";
import Loading from "@/components/Loading.vue";

export default {
  props: ["flashMsg"],
  components: { NaviMenu, Menu, Loading },
  data() {
    return {
      msg: this.flashMsg,
      errMsg: "",
      isLoading: false,
    };
  },
  async mounted() {
    /*
    try {
      if (!Auth.isLogin()) {
        this.$router.push({ name: "login", params: { flashMsg: "サインインしてください" } });
      }
    } catch (e) {
      this.$router.push({ name: "login", params: { flashMsg: "サインインしてください" } });
    }
      */
  },
};
</script>
