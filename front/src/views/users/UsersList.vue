<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <!-- タイトルとメニュー遷移ボタン -->
          <h1 class="border-bottom">ユーザー情報一覧</h1>
          <button class="btn btn-dark mb-4" v-on:click="onClickMenuButton()">メニュー画面へ</button>

          <!-- コンテンツStart -->
          <div style="width: 90%; margin: auto">
            <!-- インポートしたテーブル -->
            <Table :items="items" :fields="fields" empDataMsg="ユーザー情報がありません" @sendRow="setReceiveRow" />

            <!-- 登録・修正・削除ボタンStart -->
            <div class="form-group d-flex justify-content-center">
              <div class="p-2 w-25">
                <button class="btn btn-primary btn-block" v-on:click="onClickCreateButton()">登録</button>
              </div>
              <div class="p-2 w-25">
                <button class="btn btn-info btn-block" v-on:click="onClickEditButton()" :disabled="clientRow == null">
                  修正
                </button>
              </div>
              <div class="p-2 w-25">
                <button
                  class="btn btn-danger btn-block"
                  v-on:click="onClickDeleteButton()"
                  :disabled="clientRow == null"
                >
                  削除
                </button>
              </div>
            </div>
            <!-- 登録・修正・削除ボタンEnd -->
          </div>
        </div>
        <!-- コンテンツEnd -->
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
// 共通
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";
import UserConst from "@/utils/const/UserConst";
import Table from "../../components/Table.vue";

export default {
  props: ["flashMsg"],
  components: { Header, Loading, Table },
  data() {
    return {
      msg: this.flashMsg,
      errMsg: "",
      isLoading: false,
      clientRow: null,
      //テーブル定義
      items: [],
      fields: [
        { key: "id", label: "ID", sortable: true },
        { key: "user_id", label: "ユーザーID", sortable: false },
        { key: "user_name", label: "ユーザー名", sortable: false },
        { key: "user_role", label: "権限", sortable: false },
      ],
    };
  },
  async mounted() {
    try {
      this.isLoading = true;

      // ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });

        // 権限チェック(管理者以外拒否)
      } else if (UserUtil.currentUserInfo().userRole != UserConst.UserRole.admin) {
        this.$router.push({ name: "logIn", params: { flashMsg: "権限がありません" } });
      }

      // ユーザー情報取得
      await this.getUsers();
    } catch (e) {
      this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    /*
     *ユーザー情報取得処理
     */
    async getUsers() {
      this.msg = "";
      this.errMsg = "";

      try {
        const response = await AjaxUtil.getUsers();
        const tmpResponse = JSON.parse(response.data.Items);

        // 配列に入っている値を一つずつ取り出し、新しい変数を追加していく処理
        this.items = tmpResponse.map((user) => {
          let user_role;
          switch (user.user_role) {
            case 0:
              user_role = "一般";
              break;
            case 1:
              user_role = "管理者";
              break;
            case 2:
              user_role = "役職";
              break;
          }

          return {
            id: user.id,
            user_id: user.user_id,
            user_name: user.user_name,
            user_role: user_role,
          };
        });
      } catch (e) {
        this.msg = "";
        this.errMsg = "ユーザー情報取得処理に失敗しました。";
        console.log(e);
      }
    },

    /*
     *一覧選択行の情報を保持する
     */
    setReceiveRow(clientRow) {
      this.clientRow = clientRow;
    },

    /*
     *メニュー画面遷移
     */
    onClickMenuButton() {
      this.$router.push({ name: "menu" });
    },

    /*
     *登録画面遷移
     */
    onClickCreateButton() {
      this.$router.push({ name: "usersCreate" });
    },

    /*
     *修正画面遷移
     */
    onClickEditButton() {
      this.$router.push({ name: "usersEdit", query: { id: this.clientRow.id } });
    },

    /*
     *削除画面遷移
     */
    onClickDeleteButton() {
      this.$router.push({ name: "usersDelete", query: { id: this.clientRow.id } });
    },
  },
};
</script>
