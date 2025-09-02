<template>
  <div>
    <Header />

    <div id="content-wrapper" class="bg-light">
      <div class="container-fluid">
        <!-- タイトルとメニュー遷移ボタン -->
        <h1 class="border-bottom">顧客情報一覧</h1>
        <button class="btn btn-dark mb-4" v-on:click="onClickMenuButton()">メニュー画面へ</button>

        <!-- コンテンツStart -->
        <div style="width: 90%; margin: auto">
          <!-- テーブル上部Start -->
          <div class="row mb-3">
            <!-- 表示件数切り替え -->
            <div class="col-md-4">
              <div class="form-inline">
                <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"></b-form-select>
                <label for="per-page-select">件表示</label>
              </div>
            </div>

            <!-- 検索機能 -->
            <div class="col-md-4 ml-auto">
              <div class="form-inline">
                <label for="filter-input">検索：</label>
                <b-form-input id="filter-input" v-model="filter" type="search"></b-form-input>
              </div>
            </div>
          </div>
          <!-- テーブル上部End -->

          <!-- テーブル本体 -->
          <b-table
            id="clientsTable"
            :items="items"
            :fields="fields"
            :select-mode="'single'"
            :per-page="perPage"
            :current-page="currentPage"
            :filter="filter"
            striped
            hover
            selectable
            show-empty
            empty-text="顧客情報なし"
            empty-filtered-text="検索結果がありません"
            @row-selected="onRowSelected"
          >
          </b-table>

          <!-- テーブル下部Start -->
          <div class="row mb-3">
            <!-- ページ数表示 -->
            <div class="col-md-4">
              <p>1 ～ {{ Math.round(rows / perPage) }} ページ</p>
            </div>

            <!-- ページング機能 -->
            <div class="col-md-4 ml-auto">
              <div class="form-inline">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                  prev-text="前へ"
                  next-text="次へ"
                  aria-controls="clientsTable"
                ></b-pagination>
              </div>
            </div>
          </div>
          <!-- テーブル下部End -->

          <!-- 登録・修正・削除ボタンStart -->
          <div class="form-group d-flex justify-content-center">
            <div class="p-2 w-25">
              <button class="btn btn-primary btn-block" v-on:click="onClickCreateButton()">登録</button>
            </div>
            <div class="p-2 w-25">
              <button class="btn btn-info btn-block" v-on:click="onClickEditButton()" :disabled="clientNo == null">
                修正
              </button>
            </div>
            <div class="p-2 w-25">
              <button class="btn btn-danger btn-block" v-on:click="onClickDeleteButton()" :disabled="clientNo == null">
                削除
              </button>
            </div>
          </div>
          <!-- 登録・修正・削除ボタンEnd -->
        </div>
      </div>
      <!-- コンテンツEnd -->
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

export default {
  props: ["flashMsg"],
  components: { Header, Loading },
  data() {
    return {
      msg: this.flashMsg,
      errMsg: "",
      isLoading: false,
      clientNo: null,

      //テーブル定義
      items: [],
      fields: [
        { key: "client_noForDisplay", label: "顧客番号", sortable: true },
        { key: "name", label: "顧客名", sortable: false },
        { key: "post_code", label: "郵便番号", sortable: false },
        { key: "address1", label: "住所1", sortable: false },
        { key: "address2", label: "住所2", sortable: false },
        { key: "tel_no", label: "電話番号", sortable: false },
      ],
      // ページング定義
      currentPage: 1,
      perPage: 5,
      rows: null,
      pageOptions: [5, 10, 15],
      filter: null,
    };
  },
  async mounted() {
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });

      //権限チェック(管理者以外拒否)
      } else if (UserUtil.currentUserInfo().userRole != UserConst.UserRole.admin) {
        this.$router.push({ name: "logIn", params: { flashMsg: "権限がありません" } });
      }

      // 顧客情報取得
      await this.getClients();
      // テーブルに表示するページ数を設定
      this.rows = this.items.length;
    } catch (e) {
      this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });
    }
  },
  methods: {
    /*
     *顧客情報取得処理
     */
    getClients: async function () {
      this.isLoading = true;

      this.msg = "";
      this.errMsg = "";

      try {
        const response = await AjaxUtil.getClients();

        this.items = JSON.parse(response.data.Items);
        console.log(this.items);
      } catch (e) {
        this.msg = "";
        this.errMsg = "顧客情報取得処理に失敗しました";
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },

    /*
     *行選択時処理
     */
    onRowSelected: async function (selectedRow) {
      //選択解除時(selectedRow配列に値が入っていない場合)はnullに設定
      if (selectedRow.length == 0) {
        this.clientNo = null;
      } else {
        //selectedRowがオブジェクト配列になっているため、indexを0として取得している
        this.clientNo = selectedRow[0].client_no;
      }
    },

    /*
     *メニュー画面遷移
     */
    onClickMenuButton: async function () {
      this.$router.push({ name: "menu" });
    },

    /*
     *登録画面遷移
     */
    onClickCreateButton: async function () {
      this.$router.push({ name: "clientsCreate" });
    },

    /*
     *修正画面遷移
     */
    onClickEditButton: async function () {
      this.$router.push({ name: "clientsEdit", query: { clientNo: this.clientNo } });
    },

    /*
     *削除画面遷移
     */
    onClickDeleteButton: async function () {
      this.$router.push({ name: "clientsDelete", query: { clientNo: this.clientNo } });
    },
  },
};
</script>
