<template>
  <div id="content-wrapper" class="bg-light">
    <div class="container-fluid">
      <!-- コンテンツStart -->

      <!-- テーブル上部Start -->
      <div class="form-inline d-flex justify-content-between mb-2">
        <!-- 表示件数切り替え -->
        <div class="form-group">
          <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"></b-form-select>
          <label for="per-page-select">件表示</label>
        </div>

        <!-- 検索機能 -->
        <div class="form-group">
          <label for="filter-input">検索：</label>
          <b-form-input id="filter-input" v-model="filter" type="search"></b-form-input>
        </div>
      </div>
      <!-- テーブル上部End -->

      <!-- テーブル本体 -->
      <b-table
        id="listTable"
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
        :empty-text="empDataMsg"
        empty-filtered-text="検索結果がありません"
        @row-selected="onRowSelected"
      >
      </b-table>

      <!-- テーブル下部Start -->
      <div class="d-flex justify-content-between">
        <!-- 件数表示 -->
        <div>
          <p>計 {{ items.length }} 件</p>
        </div>

        <!-- ページング機能 -->
        <div>
          <b-pagination
            v-model="currentPage"
            :total-rows="items.length"
            :per-page="perPage"
            prev-text="前へ"
            next-text="次へ"
            aria-controls="listTable"
          ></b-pagination>
        </div>
      </div>
      <!-- テーブル下部End -->
    </div>
  </div>
  <!-- コンテンツEnd -->
</template>

<script>
export default {
  // 親コンポーネント(呼び出し元)から渡される値
  props: ["items", "fields", "empDataMsg"],

  data() {
    return {
      // ページング定義
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],

      // 検索用フィルター
      filter: null,
    };
  },

  methods: {
    /*
     *行選択時処理
     */
    onRowSelected(selectedRow) {
      let variousRow = null;

      // 行選択時のみ、値を代入
      if (selectedRow.length > 0) {
        // selectedRowがオブジェクト配列になっているため、indexを0として取得している
        variousRow = selectedRow[0];
      }

      // 親コンポーネントへ値(メソッドsendPk)を渡す
      this.$emit("sendRow", variousRow);
    },
  },
};
</script>
