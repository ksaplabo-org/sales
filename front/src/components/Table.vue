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
  </div>
</template>

<script>
export default {
  // 親テーブル(呼び出し元)から渡される値
  props: ["flashMsg", "items", "fields", "rows"],

  data() {
    return {
      msg: this.flashMsg,
      errMsg: "",

      // 選択された行を代入する用
      variousRow: null,
      
      // ページング定義
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      filter: null,
    };
  },

  methods: {
    /*
     *行選択時処理
     */
    onRowSelected: function (selectedRow) {
      //選択解除時(selectedRow配列に値が入っていない場合)はnullに設定
      if (selectedRow.length == 0) {
        this.variousRow = null;
      } else {
        // selectedRowがオブジェクト配列になっているため、indexを0として取得している
        this.variousRow = selectedRow[0];
      }
      // 親コンポーネントへ値(メソッドsendPk)を渡す
      this.$emit("sendRow", this.variousRow);
    },
  },
};
</script>
