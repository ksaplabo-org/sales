<template>
  <div>
    <Header />

    <div id="wrapper">
      <div id="content-wrapper" class="bg-light min-vh-100">
        <div class="container-fluid">
          <!-- タイトルとメニュー遷移ボタン -->
          <h1 class="border-bottom">ユーザー情報一覧</h1>
          <button class="btn btn-dark" v-on:click="onClickMenuButton()">メニュー画面へ</button>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <!-- コンテンツStart -->
          <div class="mt-4" style="width: 90%; margin: auto">
            <!-- インポートしたテーブル -->
            <Table :items="items" :fields="fields" empDataMsg="ユーザー情報がありません" @sendRow="setSelectedRow" />

            <!-- 登録・修正・削除ボタンStart -->
            <div class="form-group d-flex justify-content-center">
              <div class="p-2 w-25">
                <button class="btn btn-primary btn-block" v-on:click="onClickCreateButton()">登録</button>
              </div>
              <div class="p-2 w-25">
                <button class="btn btn-info btn-block" v-on:click="onClickEditButton()" :disabled="selectedRow == null">
                  修正
                </button>
              </div>
              <div class="p-2 w-25">
                <button
                  class="btn btn-danger btn-block"
                  v-on:click="onClickDeleteButton()"
                  :disabled="selectedRow == null"
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
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
import Table from "@/components/Table.vue";
import * as AjaxUtil from "@/utils/AjaxUtil";
import * as UserUtil from "@/utils/UserUtil";
import UserConst from "@/utils/const/UserConst";
export default {
  components: { Header, Loading, Table },
  data() {
    return {
      errMsg: "",
      isLoading: false,
      selectedRow: null,

      // 役職を値に応じてマッピングするための配列
      roleMap: {
        [UserConst.UserRole.general]: "一般",
        [UserConst.UserRole.admin]: "管理者",
        [UserConst.UserRole.post]: "役職",
      },
      
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
      // ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
      }

      this.isLoading = true;
      // ユーザー情報取得
      await this.getUsers();
    } catch (e) {
      this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください。" } });
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    /*
     *ユーザー情報取得処理
     */
    async getUsers() {
      this.errMsg = "";

      try {
        // ユーザー情報を取得
        const response = await AjaxUtil.getUsers();
        const users = JSON.parse(response.data.Items);

        // 取得したデータの役職を値に応じてマッピングし、テーブルへ代入
        this.items = users.map((user) => {
          return {
            id: user.id,
            user_id: user.user_id,
            user_name: user.user_name,
            user_role: this.roleMap[user.user_role],
          };
        });
      } catch (e) {
        this.errMsg = "ユーザー情報取得処理に失敗しました。";
        console.log(e);
      }
    },

    /*
     *一覧選択行の情報を保持する
     */
    setSelectedRow(selectedRow) {
      this.selectedRow = selectedRow;
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
      this.$router.push({ name: "usersEdit", query: { id: this.selectedRow.id } });
    },

    /*
     *削除画面遷移
     */
    onClickDeleteButton() {
      this.$router.push({ name: "usersDelete", query: { id: this.selectedRow.id } });
    },
  },
};
</script>
