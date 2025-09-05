<template>
  <div>
    <div id="content-wrapper" class="bg-light">
      <div class="container-fluid">
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
            id="listtable"
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
            empty-text="データがありません"
            empty-filtered-text="検索結果がありません"
            @row-selected="onRowSelected"
          >
          </b-table>

          <!-- テーブル下部Start -->
          <div class="row mb-3">
            <!-- 件数表示 -->
            <div class="col-md-4">
              <p>計{{ rows }}件</p>
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

export default {
  props: ["flashMsg", "items", "fields", "rows"],
  components: { Header, Loading },
  data() {
    return {
      msg: this.flashMsg,
      errMsg: "",
      isLoading: false,
      variousPk: null,
      // ページング定義
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      filter: null,
    };
  },
  async mounted() {
    try {
      //ログインチェック
      if (!UserUtil.isLogIn()) {
        this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });
      }
    } catch (e) {
      this.$router.push({ name: "logIn", params: { flashMsg: "ログインしてください" } });
    }
  },
  methods: {
    /*
     *行選択時処理
     */
    onRowSelected: function (selectedRow) {
      //選択解除時(selectedRow配列に値が入っていない場合)はnullに設定
      if (selectedRow.length == 0) {
        this.variousPk = null;
      } else {
        // selectedRowがオブジェクト配列になっているため、indexを0として取得している
        // undifindが代入されない用のif文
        if (selectedRow[0].client_noForDisplay != null) {
          this.variousPk = selectedRow[0].client_noForDisplay;
        }
        if (selectedRow[0].product_code != null) {
          this.variousPk = selectedRow[0].product_code;
        }
        if (selectedRow[0].order_no != null) {
          this.variousPk = selectedRow[0].order_no;
        }
        if (selectedRow[0].id != null) {
          this.variousPk = selectedRow[0].id;
        }

      }
      // 親コンポーネントへ値(メソッドsendPk)を渡す
      this.$emit("sendPk", this.variousPk);
    },
  },
};
</script>
