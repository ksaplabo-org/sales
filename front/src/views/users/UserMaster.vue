<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">ユーザーマスタ</h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: { name: 'top' } },
          { text: 'ユーザーマスタ', active: true },
        ]"
      />
    </div>
  </BContainer>

  <!-- トースト -->
  <BToast class="w-100" v-model="showSuccessToastMs" variant="success" no-progress>{{ successToastText }}</BToast>
  <BToast class="w-100" v-model="showFailedToastMs" variant="danger" no-progress>{{ failedToastText }}</BToast>

  <!-- 検索条件 -->
  <BCard class="shadow-sm mb-3">
    <template #header>
      <strong>検索条件</strong>
    </template>

    <BForm @submit.prevent="searchUsers">
      <BRow>
        <BCol md="4">
          <BFormGroup label="ユーザーID">
            <BFormInput placeholder="ユーザーIDを入力" v-model="condition.userId" />
          </BFormGroup>
        </BCol>

        <BCol md="4">
          <BFormGroup label="ユーザー名">
            <BFormInput placeholder="ユーザー名を入力" v-model="condition.userName" />
          </BFormGroup>
        </BCol>

        <BCol md="4">
          <BFormGroup label="権限">
            <BFormSelect
              v-model="condition.role"
              :options="[
                { value: '', text: 'すべて' },
                { value: '1', text: '一般' },
                { value: '2', text: '管理者' },
              ]"
            />
          </BFormGroup>
        </BCol>
      </BRow>

      <BRow class="mt-3">
        <BCol>
          <BFormCheckbox v-model="condition.includeDeleted"> 削除済みを含める </BFormCheckbox>
        </BCol>
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

        <BButton size="sm" variant="primary" :to="{ name: 'userCreate' }">
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
      <!-- 権限 -->
      <template #cell(role)="row">
        {{ roleOptions.find((role) => role.value === row.value)?.text }}
      </template>

      <!-- 編集・削除ボタン -->
      <template #cell(actions)="row">
        <BContainer fluid class="d-flex justify-content-center gap-2 px-0" v-if="!row.item.delFlg">
          <BButton
            size="sm"
            variant="outline-primary"
            @click="router.push({ name: 'userEdit', params: { id: row.item.userId } })"
          >
            <i class="fas fa-pen"></i>
            編集
          </BButton>
          <BButton
            size="sm"
            variant="outline-danger"
            @click="openDeleteModal(row.item)"
            v-if="row.item.userId !== loginInfo.userId"
          >
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
    @ok="deleteUser()"
  >
    <p>{{ formatMessage(messages.MSGI005, `${targetRow?.userId} `) }}</p>
  </BModal>

  <!-- ローディングマスク -->
  <Loading v-if="loading" />
</template>

<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import * as userApi from "@/api/userApi.js";
import messages from "@/constants/messages.js";
import Loading from "@/components/Loading.vue";
import { getLoginInfo } from "@/utils/auth.js";
import { formatMessage } from "@/utils/messageUtil.js";

// Router操作
const router = useRouter();

// 権限の一覧
const roleOptions = [
  { value: "1", text: "一般" },
  { value: "2", text: "管理者" },
];

// 検索結果
const items = ref([]);
// 検索結果の合計件数
const totalCount = computed(() => items.value.length);
// 一覧のカラム定義
const fields = [
  { key: "userId", label: "ユーザーID", sortable: true },
  { key: "fullName", label: "ユーザー名" },
  { key: "age", label: "年齢" },
  { key: "role", label: "権限" },
  { key: "actions", label: "" },
];

// 検索条件
const condition = reactive({
  userId: "",
  userName: "",
  role: "",
  includeDeleted: false,
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
  // 管理者以外のアクセスを拒否
  if (loginInfo.role != "2") {
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
  await searchUsers(condition);
});

/**
 * 検索条件の初期化処理
 */
const clearCondition = () => {
  Object.assign(condition, {
    userId: "",
    userName: "",
    role: "",
    includeDeleted: false,
  });
};

/**
 * ユーザー情報一覧検索処理
 */
const searchUsers = async () => {
  loading.value = true;
  try {
    items.value = await userApi.getUsers(condition);
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
 * 一覧行スタイル制御
 *
 * @param row 一覧行データ
 */
const changeRowStyle = (row) => {
  if (!row) return "";

  // 論理削除行はグレーアウトにされるように背景色を変更
  return row.delFlg ? "table-light" : "";
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
 * ユーザー削除処理
 */
const deleteUser = async () => {
  loading.value = true;
  try {
    await userApi.deleteUser(targetRow.value.userId);
    await searchUsers();
    openSuccessToast(messages.MSGI006);
  } catch (e) {
    console.log(e);
    openFailedToast(messages.MSGE007);
  } finally {
    loading.value = false;
  }
};
</script>
