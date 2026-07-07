<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">ユーザー登録</h3>
      <BBreadcrumb :items="breadcrumbs" />
    </div>
  </BContainer>

  <!-- 処理失敗トースト -->
  <BToast class="w-100" v-model="showFailedToast" variant="danger" no-progress no-close-button>{{
    messages.MSGE004
  }}</BToast>

  <!-- 登録情報 -->
  <BCard class="shadow-sm mb-3">
    <template #header>
      <strong>登録情報</strong>
    </template>

    <BForm @submit.prevent="save">
      <BRow class="mb-3">
        <BFormGroup label="ユーザーID" label-for="userId" label-cols="3">
          <div v-if="!isEdit">
            <BFormInput
              id="userId"
              v-model="form.userId"
              :state="form.userId.length === 6"
              :formatter="formatHalfWidthAlphaNumeric"
              maxlength="6"
              required
            />
            <BFormInvalidFeedback v-if="form.userId">{{
              formatMessage(messages.MSGE008, "ユーザーID", 6)
            }}</BFormInvalidFeedback>
          </div>
          <div v-else class="form-control-plaintext">{{ form.userId }}</div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="姓" label-for="lastName" label-cols="3">
          <BFormInput id="lastName" v-model="form.lastName" :state="form.lastName.length > 0" maxlength="10" required />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="名" label-for="firstName" label-cols="3">
          <BFormInput
            id="firstName"
            v-model="form.firstName"
            :state="form.firstName.length > 0"
            maxlength="10"
            required
          />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="パスワード" label-for="password" label-cols="3">
          <BFormInput
            id="password"
            type="password"
            v-model="form.password"
            :state="form.password.length > 0 && /^[A-Za-z0-9]+$/.test(form.password)"
            maxlength="20"
            required
          />
          <BFormInvalidFeedback v-if="form.password.length > 0 && !/^[A-Za-z0-9]+$/.test(form.password)">{{
            formatMessage(messages.MSGE009, "パスワード")
          }}</BFormInvalidFeedback>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="生年月日" label-for="birthday" label-cols="3">
          <BFormInput id="birthday" type="date" v-model="form.birthday" :state="form.birthday.length > 0" required />
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
            required
            v-if="!isEdit"
          />
          <div v-else class="form-control-plaintext">{{ roleText }}</div>
        </BFormGroup>
      </BRow>

      <div class="d-flex justify-content-center">
        <BButton type="submit" variant="primary">
          <i class="fas fa-save"></i>
          登録
        </BButton>
      </div>
    </BForm>
  </BCard>

  <!-- ローディングマスク -->
  <Loading v-if="loading" />
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import * as userApi from "@/api/userApi.js";
import messages from "@/constants/messages.js";
import Loading from "@/components/Loading.vue";
import * as Auth from "@/utils/auth.js";
import { formatMessage } from "@/utils/messageUtil.js";

const route = useRoute();
const router = useRouter();

// 入力情報
const form = ref({
  userId: "",
  lastName: "",
  firstName: "",
  birthday: "",
  role: "1",
  password: "",
});

// 編集画面かどうか
const isEdit = computed(() => !!route.params.id);
// ログインユーザー編集からの遷移かどうか
const fromProfile = computed(() => route.query.from === "profile");

// パンくずリスト
const breadcrumbs = computed(() => {
  // メニューから遷移の場合
  if (route.query.from === "profile") {
    return [
      { text: "トップページ", to: "/" },
      { text: "ユーザー登録", active: true },
    ];
  } else {
    // ユーザーマスタ画面から遷移の場合
    return [
      { text: "トップページ", to: "/" },
      { text: "ユーザーマスタ", to: { name: "userMaster" } },
      { text: "ユーザー登録", active: true },
    ];
  }
});

// 権限の一覧
const roleOptions = [
  { value: "1", text: "一般" },
  { value: "2", text: "管理者" },
];
// 権限設定値のテキスト
const roleText = computed(() => roleOptions.find((option) => option.value === form.value.role ?? "").text);

// 読み込み中の表示制御
const loading = ref(false);
// 処理失敗トーストの表示制御
const showFailedToast = ref(0);

// ログイン情報
const loginInfo = Auth.getLoginInfo();

// パスワード入力欄のフォーマットエラー判定
const isPasswordFormatError = computed(() => {
  return form.value.password && !/^[A-Za-z0-9]+$/.test(form.value.password);
});

/**
 * 初期表示時処理
 */
onMounted(async () => {
  // 一般の場合
  if (loginInfo.role === "1") {
    // 編集画面の場合
    if (isEdit.value) {

    } else {
      // 一般の場合、登録画面はアクセス不可
      router.push({ name: "top" });
    }
  }

  // 編集画面の場合
  if (isEdit.value) {
    // 一般の場合、自ユーザ情報のみ編集可
    if (loginInfo.role === "1" && route.params.id !== loginInfo.userId) {
      router.push({ name: "top" });
    }

    // ユーザー詳細取得
    loading.value = true;
    try {
      const userInfo = await userApi.findByUserId(route.params.id);
      Object.keys(form.value).forEach((key) => {
        if (key in userInfo) {
          form.value[key] = userInfo[key];
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
      loading.value = false;
    }
  }
});

/**
 * 半角英数のみに置換する
 *
 * @param value 検査値
 */
const formatHalfWidthAlphaNumeric = (value) => {
  return value.replace(/[^A-Za-z0-9]/g, "");
};

/**
 * 登録処理
 */
const save = async () => {
  loading.value = true;
  try {
    // 登録データを作成
    const saveData = form.value;
    if (isEdit.value) {
      saveData.updatedId = loginInfo.userId;
      await userApi.editUser(saveData);
    } else {
      saveData.createdId = loginInfo.userId;
      await userApi.createUser(saveData);
    }

    // マスタ画面に遷移
    router.push({ name: "userMaster", state: { message: "登録に成功しました", result: true } });
  } catch (e) {
    showFailedToast.value = 1500;
  } finally {
    loading.value = false;
  }
};
</script>
