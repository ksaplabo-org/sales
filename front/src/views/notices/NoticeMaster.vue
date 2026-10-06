<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">お知らせマスタ</h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/' },
          { text: 'お知らせマスタ', active: true },
        ]"
      />
    </div>
  </BContainer>

  <!-- トースト -->
  <BToast class="w-100" v-model="showSuccessToastMs" variant="success" no-progress no-close-button>{{
    successToastText
  }}</BToast>
  <BToast class="w-100" v-model="showFailedToastMs" variant="danger" no-progress no-close-button>{{
    failedToastText
  }}</BToast>

  <!-- 検索条件 -->
  <BCard class="shadow-sm mb-3">
    <template #header>
      <strong>検索条件</strong>
    </template>

    <BForm @submit.prevent="searchNotices">
      <BRow>
        <BCol md="4">
          <BFormGroup label="お知らせID">
            <BFormInput
              placeholder="お知らせIDを入力"
              maxlength="7"
              type="text"
              v-model="condition.noticeId"
              @input="formatAlphaNumericInput"
              @compositionend="formatAlphaNumericInput"
            />
          </BFormGroup>
        </BCol>
        <BCol md="4">
          <BFormGroup label="掲載期間">
            <div class="d-flex align-items-center">
              <BFormInput placeholder="開始日" type="date" v-model="condition.startSearchDate" />
              <span class="mx-2">～</span>
              <BFormInput placeholder="終了日" type="date" v-model="condition.endSearchDate" />
            </div>
          </BFormGroup>
        </BCol>
      </BRow>
      <BRow>
        <BCol md="4">
          <BFormGroup label="表示対象">
            <BFormSelect v-model="condition.targetType" :options="targetTypeOptions" />
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

        <BButton size="sm" variant="primary" :to="{ name: '' }">
          <i class="fas fa-plus"></i>
          新規登録
        </BButton>
      </div>
    </template>

    <BTable head-variant="secondary" :items="items" :fields="fields" class="mb-0" show-empty responsive hover>
      <!-- 表示対象 -->
      <template #cell(targetType)="row">
        {{ targetTypeOptions.find((targetType) => targetType.value === row.value)?.text }}
      </template>

      <!-- 掲載開始日 -->
      <template #cell(startDate)="row">
        {{ formatDate(row.item.startDate) }}
      </template>

      <!-- 掲載終了日 -->
      <template #cell(endDate)="row">
        {{ formatDate(row.item.endDate) }}
      </template>

      <!-- 編集・削除ボタン -->
      <template #cell(actions)="row">
        <BContainer fluid class="d-flex justify-content-center gap-2 px-0">
          <BButton
            size="sm"
            variant="outline-primary"
            @click="
              router.push({
                name: 'noticeEdit',
                params: { noticeId: row.item.noticeId },
              })
            "
          >
            <i class="fas fa-pen"></i>
            編集
          </BButton>
          <BButton size="sm" variant="outline-danger" @click="openDeleteModal(row.item)">
            <i class="far fa-trash-alt"></i>
            削除
          </BButton>
        </BContainer>
      </template>

      <!-- 検索結果なし -->
      <template #empty>
        <div class="text-center py-0">{{ messages.MSGI002 }}</div>
      </template>
    </BTable>
  </BCard>

  <!-- 削除確認モーダル -->
  <BModal
    v-model="showDeleteModal"
    title="削除確認"
    ok-title="削除"
    ok-variant="danger"
    cancel-title="キャンセル"
    @ok="deleteNotice()"
  >
    <p>{{ targetRow?.noticeId }} を削除しますか？</p>
  </BModal>

  <!-- ローディングマスク -->
  <Loading v-if="loading" />
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import * as noticeApi from "@/api/noticeApi.js";
import messages from "@/constants/messages.js";
import Loading from "@/components/Loading.vue";
import { getLoginInfo } from "@/utils/auth.js";
import { formatMessage } from "@/utils/messageUtil.js";

// Router操作
const router = useRouter();

// 受発注区分の選択肢一覧
const targetTypeOptions = [
  { value: "", text: "指定なし" },
  { value: "0", text: "全ユーザー" },
  { value: "1", text: "一般ユーザーのみ" },
  { value: "2", text: "管理者ユーザーのみ" },
];

// 受発注区分表示の一覧
const showtargetTypeOptions = [
  { value: "0", text: "全ユーザー" },
  { value: "1", text: "一般ユーザーのみ" },
  { value: "2", text: "管理者ユーザーのみ" },
];

// 検索結果
const items = ref([]);
// 検索結果の合計件数
const totalCount = computed(() => items.value.length);
// 一覧のカラム定義
const fields = [
  { key: "noticeId", label: "お知らせID", sortable: true },
  { key: "title", label: "タイトル" },
  { key: "startDate", label: "掲載開始日", sortable: true },
  { key: "endDate", label: "掲載終了日", sortable: true },
  { key: "targetType", label: "表示対象" },
  { key: "actions", label: "" },
];

// 検索条件
const condition = ref({
  noticeId: "",
  startSerchDate: "",
  endSearchDate: "",
  targetType: "",
});

// 読み込み中の表示制御
const loading = ref(false);
// 削除確認モーダルの表示制御
const showDeleteModal = ref(false);
// 処理中のデータ
const targetRow = ref(null);

// トースト表示ミリ秒
const TOAST_MS = 1500;

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
  //ログイン権限が"2"(管理者)以外の場合
  if (loginInfo.role !== "2") {
    router.push({ name: "top" });
  }
  // 登録画面からの遷移の場合にメッセージを出力
  const state = history.state;
  if (state.result) {
    // 成功メッセージ表示
    openSuccessToast(state.message);

    // 再表示の防止のためstateを初期化
    history.replaceState({}, "");
  }

  // 一覧検索
  await searchNotices();
});

/**
 * 検索条件の初期化処理
 */
const clearCondition = () => {
  condition.value = {
    noticeId: "",
    startSerchDate: "",
    endSearchDate: "",
    targetType: "",
  };
};

/**
 * お知らせ情報一覧検索処理
 */
const searchNotices = async () => {
  loading.value = true;
  try {
    items.value = await noticeApi.getNotices(condition.value);
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

/**
 * 削除確認モーダル表示処理
 *
 * @param row 一覧行データ
 */
const openDeleteModal = (row) => {
  targetRow.value = row;
  showDeleteModal.value = true;
};

/**
 * お知らせ情報削除処理
 */
const deleteNotice = async () => {
  loading.value = true;
  try {
    await noticeApi.deleteNotice(targetRow.value.noticeId);
    openSuccessToast(messages.MSGI006);
    await searchNotices();
  } catch (e) {
    console.log(e);
    openFailedToast(messages.MSGE007);
  } finally {
    loading.value = false;
  }
};

/**
 * 日付表示変換処理
 *
 * @param date 日付
 */
const formatDate = (date) => {
  return date ? date.replace(/-/g, "/") : "";
};

/**
 * 半角英数字変換処理
 *
 * @param event 画面からの情報
 */
const formatAlphaNumericInput = (event) => {
  // IME変換中の値は変換しないように制御
  if (event.isComposing) return;

  const input = event.target;
  const formatValue = input.value.replace(/[^A-Za-z0-9]/g, ""); // フォーマット処理
  if (input.value !== formatValue) {
    // 入力値にフォーマットした値を反映
    input.value = formatValue;
    // 双方向バインディングに反映するためinputイベントを発火
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
};
</script>
