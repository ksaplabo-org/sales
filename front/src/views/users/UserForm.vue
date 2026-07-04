<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">ユーザー登録</h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/' },
          { text: 'ユーザーマスタ', to: { name: 'userMaster' } },
          { text: 'ユーザー登録', active: true },
        ]"
      />
    </div>
  </BContainer>

  <!-- トースト -->
  <BToast v-model="showFailedToast" variant="danger" no-progress no-close-button>登録に失敗しました</BToast>

  <!-- 登録情報 -->
  <BCard class="shadow-sm mb-3">
    <template #header>
      <strong>登録情報</strong>
    </template>

    <BForm @submit.prevent="save">
      <BRow class="mb-3">
        <BFormGroup label="ユーザーID" label-for="userId" label-cols="3">
          <BFormInput id="userId" v-model="form.userId" v-if="!isEdit" :state="form.userId.length > 0" required />
          <div v-else class="form-control-plaintext">{{ form.userId }}</div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="姓" label-for="lastName" label-cols="3">
          <BFormInput id="lastName" v-model="form.lastName" :state="form.lastName.length > 0" required />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="名" label-for="firstName" label-cols="3">
          <BFormInput id="firstName" v-model="form.firstName" :state="form.firstName.length > 0" required />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="パスワード" label-for="password" label-cols="3">
          <BFormInput
            id="password"
            type="password"
            v-model="form.password"
            :state="form.password.length > 0"
            trim
            required
          />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="生年月日" label-for="birthday" label-cols="3">
          <BFormInput
            id="birthday"
            type="date"
            v-model="form.birthday"
            :state="form.birthday.length > 0"
            trim
            required
          />
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
import * as Auth from "@/utils/auth.js";
import Loading from "@/components/Loading.vue";

const route = useRoute();
const router = useRouter();

const form = ref({
  userId: "",
  lastName: "",
  firstName: "",
  birthday: "",
  role: "1",
  password: "",
});

const isEdit = computed(() => !!route.params.id);

// 権限の一覧
const roleOptions = [
  { value: "1", text: "一般" },
  { value: "2", text: "管理者" },
];
// 権限設定値のテキスト
const roleText = computed(() => roleOptions.find((option) => option.value === form.value.role ?? "").text);

// 読み込み中の表示制御
const loading = ref(false);
// 処理中のデータ
const targetRow = ref(null);
// 削除成功・失敗トーストの表示制御
const showSuccessToast = ref(0);
const showFailedToast = ref(0);

// ログイン情報
const loginInfo = Auth.currentUserInfo();

/**
 * 初期表示時処理
 */
onMounted(async () => {
  if (isEdit.value) {
    if (loginInfo.role === "1" && route.params.id !== loginInfo.userId) {
      // アクセス制御
      // TODO: ログイン画面に戻すか、NotFoundにするか？
      console.log(loginInfo);
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
 * 登録処理
 */
const save = async () => {
  loading.value = true;
  try {
    // 現在時刻を取得
    const currentTime = new Date().toISOString();
    // 登録データを作成
    const saveData = form.value;
    saveData.updatedId = loginInfo.userId;
    saveData.updatedAt = currentTime;
    if (isEdit.value) {
      await userApi.editUser(saveData);
    } else {
      console.log(saveData);
      saveData.createdId = loginInfo.userId;
      saveData.createdAt = currentTime;
      await userApi.createUser(saveData);
    }

    // マスタ画面に遷移
    router.push({ name: "userMaster", state: { message: "登録に成功しました", result: true } });
  } catch (e) {
    console.log(e);
    showFailedToast.value = 3000;
  } finally {
    loading.value = false;
  }
};
</script>
