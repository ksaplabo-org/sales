<template>
  <div class="container">
    <div class="d-flex justify-content-center align-items-start min-vh-100 pt-5">
      <!-- ログイン情報入力フォーム -->
      <BCard class="custom-card">
        <BForm @submit.prevent="login">
          <BCardText>
            <!-- ユーザーID -->
            <div class="form-floating mb-3">
              <BFormInput id="userId" placeholder="" v-model="userId" maxlength="8" required />
              <label for="userId">ユーザーID</label>
            </div>

            <!-- パスワード -->
            <div class="form-floating">
              <BFormInput id="password" type="password" placeholder="" v-model="password" maxlength="16" required />
              <label for="password">パスワード</label>
            </div>
          </BCardText>
          <BButton type="submit" class="w-100" variant="primary">ログイン</BButton>
        </BForm>
      </BCard>
    </div>

    <!-- エラー表示用モーダル -->
    <BModal v-model="visible" title="ログイン失敗" ok-only>
      <p class="multiline">{{ errorMessage }}</p>
    </BModal>

    <!-- ローディング -->
    <Loading v-if="isLoading === true" />
  </div>
</template>

<style>
.custom-card {
  width: 500px;
  max-width: 90%;
}
.multiline {
  white-space: pre-line;
}
</style>

<script setup>
import { ref } from "vue";

// コンポーネント
import Loading from "@/components/Loading.vue";
// ルーティング
import router from "@/router/index.js";
// ユーティリティ
import * as Auth from "@/utils/auth.js";

// リアクティブ変数
const userId = ref();
const password = ref();
let visible = ref(false);
let errorMessage = ref();
let isLoading = ref(false);

/**
 * ログイン
 */
async function login() {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    await Auth.login(userId.value, password.value);
    router.push({ name: "top" });
  } catch (e) {
    if (e.response.status === 401) {
      errorMessage.value = `ログインに失敗しました。入力項目を確認してください。\n\nユーザーID=${userId.value}\nパスワード=${(userId.value, password.value)}`;
    } else {
      errorMessage.value = e.message;
    }
    visible.value = true;
  } finally {
    isLoading.value = false;
  }
}
</script>
