<template>
  <h5 class="fw-bold">ユーザー情報</h5>

  <!--
  <div class="p-3 bg-light rounded border">
    <BBreadcrumb
      :items="[
        { text: 'トップページ', to: '/pages/top.html' },
        { text: 'ユーザー一覧', to: '/pages/users/list.html', active: true },
      ]"
    />
  </div>
  -->

  <div>
    <BTable
      select-mode="multi"
      selected-variant="primary"
      :selectable="!selectable"
      :no-select-on-click-row="!selectable"
      @row-selected="onSelected"
      head-variant="dark"
      :items="items"
      :fields="fields"
    >
      <template #cell(actions)="row">
        <BButton size="sm" variant="primary" @click="editRow(row.item)">編集</BButton>
      </template>
    </BTable>
  </div>

  <BContainer fluid class="d-flex justify-content-center gap-3 bg-light">
    <BButton size="sm" variant="primary" @click="editRow(row.item)">登録</BButton>
    <BButton size="sm" variant="danger" @click="toggleSelectable">削除</BButton>
  </BContainer>

  <!-- スクロールトップボタン-->
  <ScrollTop />

  <!-- ローディングマスク -->
  <Loading v-if="isLoading === true" />
</template>

<script setup>
import { ref } from 'vue'
import Loading from "@/components/Loading.vue";
import ScrollTop from "@/components/ScrollTop.vue";

const items = [
  { age: 40, first_name: "Dickerson", last_name: "Macdonald" },
  { age: 21, first_name: "Larsen", last_name: "Shaw" },
  { age: 89, first_name: "Geneva", last_name: "Wilson" },
  { age: 38, first_name: "Jami", last_name: "Carney" },
];
const fields = [
  { key: "age", label: "年齢", stickyColumn: true },
  { key: "first_name", label: "名" },
  { key: "last_name", label: "姓" },
  { key: "actions", label: "" },
];
const tableRef = ref();
const isLoading = false;
const selectable = ref(false);

const toggleSelectable = () => {
  selectable.value = !(selectable.value);

  if (!selectable.value) {
    tableRef.value?.clearSelected();
  }
}

const onSelected = (rows) => {
  console.log(rows)
}
</script>
