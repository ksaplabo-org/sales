<template>
  <BContainer fluid class="px-0 pb-2 mb-0">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">ユーザーマスタ</h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/pages/top.html' },
          { text: 'ユーザーマスタ', to: '/pages/users/list.html', active: true },
        ]"
      />
    </div>
  </BContainer>

  <BCard class="shadow-sm border-0 mb-4">
    <h5 class="fw-bold mb-4">検索条件</h5>

    <BRow>
      <BCol md="3">
        <BFormGroup label="ユーザーID">
          <BFormInput placeholder="ユーザーIDを入力" />
        </BFormGroup>
      </BCol>

      <BCol md="3">
        <BFormGroup label="ユーザー名">
          <BFormInput placeholder="ユーザー名を入力" />
        </BFormGroup>
      </BCol>
    </BRow>

    <div class="text-end mt-3">
      <BButton variant="outline-secondary" class="me-2">
        <i class="fas fa-redo"></i>
        クリア
      </BButton>

      <BButton variant="primary">
        <i class="fas fa-search"></i>
        検索
      </BButton>
    </div>
  </BCard>

  <BContainer fluid class="d-flex gap-3 px-0 bg-light">
    <BButton size="sm" variant="primary">
      <i class="fas fa-plus"></i>
      新規登録
    </BButton>
  </BContainer>

  <p></p>

  <BTable
    select-mode="multi"
    selected-variant="primary"
    :selectable="!selectable"
    :no-select-on-click-row="!selectable"
    @row-selected="onSelected"
    head-variant="secondary"
    :items="items"
    :fields="fields"
    responsive
    
  >
    <template #cell(actions)="row">
      <BContainer fluid class="d-flex justify-content-center gap-2 px-0">
        <BButton size="sm" variant="outline-primary">
          <i class="fas fa-pen"></i>
          編集
        </BButton>
        <BButton size="sm" variant="outline-danger">
          <i class="far fa-trash-alt"></i>
          削除
        </BButton>
      </BContainer>
    </template>
  </BTable>

  <!-- スクロールトップボタン-->
  <ScrollTop />

  <!-- ローディングマスク -->
  <Loading v-if="isLoading === true" />
</template>

<script setup>
import { ref } from "vue";
import Loading from "@/components/Loading.vue";
import ScrollTop from "@/components/ScrollTop.vue";

const items = [
  {
    user_id: "a01b0001",
    user_name: "山田 太郎",
    age: 40,
    role: "一般",
  },
  {
    user_id: "a01b0002",
    user_name: "山田 次郎",
    age: 35,
    role: "管理者",
  },
  {
    user_id: "a01b0003",
    user_name: "山田 花子",
    age: 30,
    role: "一般",
  },
  {
    user_id: "a02b0001",
    user_name: "佐藤 花子",
    age: 49,
    role: "管理者",
  },
  {
    user_id: "a02b0002",
    user_name: "佐藤 太郎",
    age: 31,
    role: "一般",
  },
];
const fields = [
  { key: "user_id", label: "ユーザーID", stickyColumn: true },
  { key: "user_name", label: "ユーザー名", stickyColumn: true },
  { key: "age", label: "年齢", stickyColumn: true },
  { key: "role", label: "役職" },
  { key: "actions", label: "" },
];
const tableRef = ref();
const isLoading = false;
const selectable = ref(false);

const toggleSelectable = () => {
  selectable.value = !selectable.value;

  if (!selectable.value) {
    tableRef.value?.clearSelected();
  }
};

const onSelected = (rows) => {
  console.log(rows);
};
</script>
