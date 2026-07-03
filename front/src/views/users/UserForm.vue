<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">ユーザー登録</h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/' },
          { text: 'ユーザーマスタ', to: '/master/users' },
          { text: 'ユーザー登録', to: '/master/users/form', active: true },
        ]"
      />
    </div>
  </BContainer>

  <!-- トースト -->
  <BToast v-model="showSuccessToast" variant="success" no-progress no-close-button>登録に成功しました</BToast>
  <BToast v-model="showFailedToast" variant="danger" no-progress no-close-button>登録に失敗しました</BToast>

  <BContainer class="shadow-sm align-items-center">
    <BForm @submit.prevent="">
      <BRow class="mb-3">
        <BFormGroup label="ユーザーID" label-for="userIdInput" label-cols="3">
          <BFormInput id="userIdInput" v-model="form.userId" :state="form.userId.length > 0" trim />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="姓" label-for="lastName" label-cols="3">
          <BFormInput id="lastName" v-model="form.lastName" :state="form.lastName.length > 0" trim />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="名" label-for="firstName" label-cols="3">
          <BFormInput id="firstName" v-model="form.firstName" :state="form.firstName.length > 0" trim />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="パスワード" label-for="password" label-cols="3">
          <BFormInput id="password" type="password" v-model="form.password" :state="form.password.length > 0" trim />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="パスワード(確認用)" label-for="firstName" label-cols="3">
          <BFormInput id="firstName" v-model="form.firstName" :state="form.firstName.length > 0" trim />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="生年月日" label-for="birthday" label-cols="3">
          <BFormInput id="birthday" type="date" v-model="form.birthday" :state="form.birthday.length > 0" trim />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="権限" label-for="role" label-cols="3">
          <BFormSelect
            v-model="form.role"
            :options="[
              { value: '1', text: '一般' },
              { value: '2', text: '管理者' },
            ]"
          />
        </BFormGroup>
      </BRow>

      <div class="d-flex justify-content-center">
        <BButton variant="primary">登録</BButton>
      </div>
    </BForm>
  </BContainer>

  <!-- ローディングマスク -->
  <Loading v-if="loading" />
</template>

<script setup>
import { computed, ref, onMounted } from "vue";

import * as userApi from "@/api/userApi.js";
import Loading from "@/components/Loading.vue";

const form = ref({
  userId: "a",
  lastName: "",
  firstName: "",
  birthday: "",
  role: "1",
  password: "",
});

const reenterPassword = "";

const floatingState = computed(() => form.value.userId.length >= 4);

// 権限の一覧
const roleOptions = [
  { value: "1", text: "一般" },
  { value: "2", text: "管理者" },
];

// 検索条件
const condition = ref({
  userId: "",
  userName: "",
  role: "",
  includeDeleted: false,
});

// 検索結果
const items = ref([]);
// 検索結果の合計件数
const totalCount = computed(() => items.value.length);
// 一覧のカラム定義
const fields = [
  { key: "userId", label: "ユーザーID" },
  { key: "userName", label: "ユーザー名" },
  { key: "age", label: "年齢" },
  { key: "role", label: "権限" },
  {
    key: "updatedAt",
    label: "更新日時",
    formatter: ({ value }) => {
      return formatDatetime(value);
    },
  },
  { key: "actions", label: "" },
];

// 読み込み中の表示制御
const loading = ref(false);
// 削除確認モーダルの表示制御
const showDeleteModal = ref(false);
// 削除成功モーダルの表示制御
const showDeleteSuccessModal = ref(false);
// 処理中のデータ
const targetRow = ref(null);
// アラートモーダルのタイトル
const alertTitle = ref("");
// アラートモーダルのメッセージ
const alertMessage = ref("");
const showDismissibleAlert = ref(false);
const showSuccessToast = ref(0);
const showFailedToast = ref(0);
const countdown = ref(0);

// 検索条件の初期化処理
const clearCondition = () => {
  condition.value = {
    userId: "",
    userName: "",
    role: "",
    includeDeleted: false,
  };
};

// 検索処理
const search = async () => {
  loading.value = true;
  const users = await userApi.findUsers(condition.value);
  items.value = users.data;
  loading.value = false;
};

// 削除確認モーダル表示処理
const openDeleteModal = (row) => {
  targetRow.value = row;
  showDeleteModal.value = true;
};

// ユーザー削除処理
const deleteUser = async () => {
  try {
    await userApi.deleteUser(targetRow.value.userId);
    await search();
    showSuccessToast.value = 3000;
  } catch (e) {
    console.log(e);
    showFailedToast.value = 3000;
  }
};

// 初期表示時処理
onMounted(async () => await search(condition.value));
</script>
