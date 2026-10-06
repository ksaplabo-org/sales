<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">お知らせ登録</h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/' },
          { text: 'お知らせマスタ', to: { name: 'noticeMaster' } },
          { text: 'お知らせ登録', active: true },
        ]"
      />
    </div>
  </BContainer>

  <!-- 処理失敗トースト -->
  <BToast class="w-100" v-model="showFailedToastMs" variant="danger" no-progress no-close-button>{{
    failedToastText
  }}</BToast>

  <!-- 登録情報 -->
  <BCard class="shadow-sm mb-3">
    <template #header>
      <strong>登録情報</strong>
    </template>

    <BForm @submit.prevent="save">
      <BRow class="mb-3">
        <BFormGroup label="お知らせID" label-for="noticeId" label-cols="3">
          <div v-if="!isEdit">
            <BFormInput
              id="noticeId"
              :state="form.noticeId.length === 7"
              maxlength="7"
              type="text"
              v-model="form.noticeId"
              @input="formatAlphaNumericInput"
              @compositionend="formatAlphaNumericInput"
              required
            />
            <BFormInvalidFeedback v-if="form.noticeId">{{
              formatMessage(messages.MSGE008, "お知らせID", 7)
            }}</BFormInvalidFeedback>
          </div>
          <div v-else class="form-control-plaintext">
            {{ form.noticeId }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="タイトル" label-for="title" label-cols="3">
          <BFormInput
            id="title"
            v-model="form.title"
            :state="form.title.length > 0 && form.title.length <= 20"
            maxlength="20"
            required
          />
        </BFormGroup>
      </BRow>
      <BRow class="mb-3">
        <BFormGroup label="内容" label-for="content" label-cols="3">
          <BFormTextarea id="content" v-model="form.content" :state="form.content ? true : false" required />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="掲載開始日" label-for="startDate" label-cols="3">
          <BFormInput id="startDate" type="date" v-model="form.startDate" :state="getStartDatestate" required />
          <div v-if="getStartDateErrorMessage" class="invalid-feedback d-block">
            {{ getStartDateErrorMessage }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="掲載終了日" label-for="endDate" label-cols="3">
          <BFormInput id="endDate" type="date" v-model="form.endDate" :state="getEndDateState" required />
          <div v-if="getEndDateErrorMessage" class="invalid-feedback d-block">
            {{ getEndDateErrorMessage }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="表示対象" label-cols="3">
          <BFormRadioGroup
            v-model="form.targetType"
            :options="[
              { value: '0', text: '全ユーザー' },
              { value: '1', text: '一般ユーザー' },
              { value: '2', text: '管理者ユーザー' },
            ]"
            value-field="value"
            text-field="text"
          />
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

import * as productApi from "@/api/productApi.js";
import * as clientApi from "@/api/clientApi.js";
import * as noticeApi from "@/api/noticeApi.js";
import messages from "@/constants/messages.js";
import Loading from "@/components/Loading.vue";
import * as Auth from "@/utils/auth.js";
import { formatMessage } from "@/utils/messageUtil.js";

const route = useRoute();
const router = useRouter();

// 入力情報
const form = ref({
  noticeId: "",
  title: "",
  content: "",
  startDate: "",
  endDate: "",
  targetType: "0",
});

// 編集画面かどうか
const isEdit = computed(() => !!route.params.noticeId);

// 読み込み中の表示制御
const loading = ref(false);

//トースト表示ミリ秒
const TOAST_MS = 1500;

// 処理失敗トーストの表示制御
const failedToastText = ref("");
const showFailedToastMs = ref(0);

// ログイン情報
const loginInfo = Auth.getLoginInfo();

//登録済みの掲載開始日
const registeredStartDate = ref("");

/**
 * 初期表示時処理
 */
onMounted(async () => {
  // 一般の場合
  if (loginInfo.role !== "2") {
    router.push({ name: "top" });
  }
  loading.value = true;
  // 編集画面の場合
  if (isEdit.value) {
    // 商品情報詳細取得
    try {
      const noticeInfo = await noticeApi.getNoticeByNoticeId(route.params.noticeId);
      Object.keys(form.value).forEach((key) => {
        form.value[key] = noticeInfo[key];
      });
      registeredStartDate.value = noticeInfo.startDate;
    } catch (e) {
      console.log(e);
      showFailedToast(messages.MSGE001);
    }
  }
  loading.value = false;
});

/**
 * 登録処理
 */
const save = async () => {
  console.log(form.value);
  loading.value = true;
  try {
    if (isEdit.value) {
      form.value.updatedId = loginInfo.userId;
      await noticeApi.updateNotice(form.value);
    } else {
      form.value.createdId = loginInfo.userId;
      await noticeApi.createNotice(form.value);
    }

    // マスタ画面に遷移
    router.push({
      name: "noticeMaster",
      state: { message: messages.MSGI003, result: true },
    });
  } catch (e) {
    console.log(e);
    showFailedToast(messages.MSGE004);
  } finally {
    loading.value = false;
  }
};

/**
 * 処理失敗トースト表示処理
 *
 * @param message メッセージ
 */
const showFailedToast = (message) => {
  failedToastText.value = message;
  showFailedToastMs.value = TOAST_MS;
};

/**
 * 掲載開始日の状態判定
 *
 * true  : エラーなし
 * false : エラーあり
 */
const getStartDatestate = computed(() => {
  // 未入力は別判定
  if (!form.value.startDate) {
    return false;
  }

  const startDate = new Date(form.value.startDate);

  const systemDate = new Date();
  systemDate.setHours(0, 0, 0, 0);

  // 編集
  if (isEdit.value) {
    const registeredDate = new Date(registeredStartDate.value);

    const isSameDate =
      startDate.getFullYear() === registeredDate.getFullYear() &&
      startDate.getMonth() === registeredDate.getMonth() &&
      startDate.getDate() === registeredDate.getDate();

    return isSameDate && startDate < systemDate;
  }

  // 登録
  return startDate > systemDate;
});

/**
 * 掲載終了日の状態判定
 * true  : 緑枠
 * false : 赤枠
 * null  : 黒枠
 */
const getEndDateState = computed(() => {
  // 両方未入力
  if (!form.value.endDate || form.value.startDate > form.value.endDate) {
    return false;
  }

  // 開始日未入力、終了日のみ入力
  if (!form.value.startDate && form.value.endDate) {
    return null;
  }

  return true;
});

/**
 * 掲載開始日エラーメッセージ取得
 */
const getStartDateErrorMessage = computed(() => {
  if (!form.value.startDate) {
    return "";
  }

  if (!getStartDatestate.value && isEdit.value) {
    return formatMessage(messages.MSGE017, "掲載開始日", "登録済みの掲載開始日と同じ日付、または本日");
  }
  if (!getStartDatestate.value && !isEdit.value) {
    return formatMessage(messages.MSGE017, "掲載開始日", "本日");
  }

  return "";
});

/**
 * 掲載終了日エラーメッセージ取得
 */
const getEndDateErrorMessage = computed(() => {
  // 掲載開始日、掲載終了日未入力
  if (!form.value.endDate) {
    return "";
  }
  // 掲載開始日と掲載終了日の比較
  if (form.value.startDate > form.value.endDate) {
    return formatMessage(messages.MSGE017, "掲載終了日", "掲載開始日");
  }

  return "";
});

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
