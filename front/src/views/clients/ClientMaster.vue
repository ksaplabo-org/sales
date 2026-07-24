<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">取引先マスタ</h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/' },
          { text: '取引先マスタ', active: true },
        ]"
      />
    </div>
  </BContainer>

  <!-- トースト -->
  <BToast class="w-100" v-model="showSuccessToastMs" variant="success" no-close-button no-progress>{{
    successToastText
  }}</BToast>
  <BToast class="w-100" v-model="showFailedToastMs" variant="danger" no-close-button no-progress>{{
    failedToastText
  }}</BToast>

  <!-- 検索条件 -->
  <BCard class="shadow-sm mb-3">
    <template #header>
      <strong>検索条件</strong>
    </template>

    <BForm @submit.prevent="searchClients">
      <BRow>
        <BCol md="4">
          <BFormGroup label="取引先コード">
            <BFormInput placeholder="取引先コードを入力" v-model="condition.clientCode" />
          </BFormGroup>
        </BCol>

        <BCol md="4">
          <BFormGroup label="取引先名">
            <BFormInput placeholder="取引先名を入力" v-model="condition.clientName" />
          </BFormGroup>
        </BCol>

        <BCol md="4">
          <BFormGroup label="受発注区分">
            <BFormSelect
              v-model="condition.orderKbn"
              :options="[
                { value: '', text: '全て表示' },
                { value: '1', text: '受注のみ表示' },
                { value: '2', text: '発注のみ表示' },
              ]"
            />
          </BFormGroup>
        </BCol>
      </BRow>

      <BRow class="mt-3">
        <BCol class="text-end">
          <BButton variant="outline-secondary" class="me-2" @click="clearCondition">
            <i class="fas fa-redo"></i>
            クリア
          </BButton>
          <BButton type="submit" variant="primary">
            <i class="fas fa-search"></i>
            検索
          </BButton>
        </BCol>
      </BRow>
    </BForm>
  </BCard>

  <!-- 検索結果 -->
  <BCard class="shadow-sm">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <strong>検索結果 ( {{ totalCount }} 件 )</strong>

        <BButton size="sm" variant="primary" :to="{ name: 'clientCreate' }" v-if="loginInfo.role == 2">
          <i class="fas fa-plus"></i>
          新規登録
        </BButton>
      </div>
    </template>

    <BTable
      head-variant="secondary"
      :items="items"
      :fields="fields"
      :tbody-tr-class="changeRowStyle"
      class="mb-0"
      show-empty
      responsive
      hover
    >
      <!-- 受発注区分 -->
      <template #cell(orderKbn)="row">
        {{ orderKbnOptions.find((orderKbn) => orderKbn.value === row.value)?.text }}
      </template>

      <!-- 編集ボタン -->
      <template #cell(actions)="row">
        <BContainer fluid class="d-flex justify-content-center gap-2 px-0">
          <BButton
            size="sm"
            variant="outline-primary"
            @click="router.push({ name: 'clientEdit', params: { code: row.item.clientCode } })"
            v-if="loginInfo.role == 2"
          >
            <i class="fas fa-pen"></i>
            編集
          </BButton>
        </BContainer>
      </template>

      <!-- 検索結果なし -->
      <template #empty>
        <div class="text-center py-0">{{ messages.MSGI002 }}</div>
      </template>
    </BTable>
  </BCard>

  <!-- ローディングマスク -->
  <Loading v-if="loading" />
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import * as clientApi from "@/api/clientApi.js";
import messages from "@/constants/messages.js";
import Loading from "@/components/Loading.vue";
import { getLoginInfo } from "@/utils/auth.js";
import { formatMessage } from "@/utils/messageUtil.js";

// Router操作
const router = useRouter();

// 受発注区分の一覧
const orderKbnOptions = [
  { value: "1", text: "受注" },
  { value: "2", text: "発注" },
];

// 検索結果
const items = ref([]);
// 検索結果の合計件数
const totalCount = computed(() => items.value.length);
// 一覧のカラム定義
const fields = [
  { key: "clientCode", label: "取引先コード", sortable: true },
  { key: "clientName", label: "取引先名" },
  { key: "orderKbn", label: "受発注区分" },
  { key: "postCode", label: "郵便番号" },
  { key: "fullAddress", label: "住所" },
  { key: "telNumber", label: "電話番号" },
  { key: "actions", label: "" },
];

// 検索条件
const condition = ref({
  clientCode: "",
  clientName: "",
  orderKbn: "",
});

// 読み込み中の表示制御
const loading = ref(false);
// 処理中のデータ
const targetRow = ref(null);

// トースト表示ミリ秒
const TOAST_MS = 3000;

// 処理成功・失敗トーストの表示制御
const successToastText = ref("");
const failedToastText = ref("");
const showSuccessToastMs = ref(0);
const showFailedToastMs = ref(0);

// ログイン情報
const loginInfo = getLoginInfo();

/**
 * 初期表示処理
 */
onMounted(async () => {
  // 一覧検索
  await searchClients(condition.value);
  // 登録画面からの遷移の場合にメッセージを出力
  const state = history.state;
  if (state.result) {
    // 成功メッセージ表示
    openSuccessToast(state.message);

    // 再表示の防止のためstateを初期化
    history.replaceState({}, "");
  }
});

/**
 * 検索条件の初期化処理
 */
const clearCondition = () => {
  condition.value = {
    clientCode: "",
    clientName: "",
    orderKbn: "",
  };
};

/**
 * 取引先情報一覧検索処理
 */
const searchClients = async () => {
  loading.value = true;
  try {
    items.value = await clientApi.getClients(condition.value);
  } catch (e) {
    console.log(e);
    openFailedToast(messages.MSGE001);
  } finally {
    loading.value = false;
  }
};

/**
 * 処理成功トースト表示処理
 *
 * @param message メッセージ
 */
const openSuccessToast = (message) => {
  successToastText.value = message;
  showSuccessToastMs.value = TOAST_MS;
};

/**
 * 処理失敗トースト表示処理
 *
 * @param message メッセージ
 */
const openFailedToast = (message) => {
  failedToastText.value = message;
  showFailedToastMs.value = TOAST_MS;
};
</script>
