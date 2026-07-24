<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">取引先登録</h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/' },
          { text: '取引先マスタ', to: { name: 'clientMaster' } },
          { text: '取引先登録', active: true },
        ]"
      />
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
        <BFormGroup label="取引先コード" label-for="clientCode" label-cols="3">
          <div v-if="!isEdit">
            <BFormInput
              id="clientCode"
              v-model="form.clientCode"
              :state="form.clientCode.length === 8"
              :formatter="formatHalfWidthAlphaNumeric"
              maxlength="8"
              required
            />
            <BFormInvalidFeedback v-if="form.clientCode">{{
              formatMessage(messages.MSGE008, "取引先コード", 8)
            }}</BFormInvalidFeedback>
          </div>
          <div v-else class="form-control-plaintext">{{ form.clientCode }}</div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="取引先名" label-for="clientName" label-cols="3">
          <BFormInput id="clientName" v-model="form.clientName" :state="form.clientName.length > 0" maxlength="20" required />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="受発注区分" label-for="orderKbn" label-cols="3">
          <BFormSelect
            v-model="form.orderKbn"
            :options="[
              { value: '1', text: '受注' },
              { value: '2', text: '発注' },
            ]"
            required
            v-if="!isEdit"
          />
          <div v-else class="form-control-plaintext">{{ orderKbnText }}</div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="郵便番号" label-for="postCode" label-cols="3">
          <BFormInput
            id="postCode"
            v-model="form.postCode"
            :state="form.postCode.length === 0 || (form.postCode.length === 7 && /^[0-9]+$/.test(form.postCode))"
            :formatter="formatPostCode"
            maxlength="7"
            placeholder="-は入力しないでください"
          />
          <BFormInvalidFeedback v-if="form.postCode">{{
              formatMessage(messages.MSGE008, "郵便番号", 7)
            }}</BFormInvalidFeedback>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="住所1" label-for="address1" label-cols="3">
          <BFormInput id="address1" v-model="form.address1" :state="form.address1.length >= 0" maxlength="20" />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="住所2" label-for="address2" label-cols="3">
          <BFormInput id="address2" v-model="form.address2" :state="form.address2.length >= 0" maxlength="20" />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="電話番号" label-for="telNumber" label-cols="3">
          <BFormInput
            id="telNumber"
            v-model="form.telNumber"
            :state="form.telNumber.length === 0 || (form.telNumber.length === 13 && /^\d{3}-\d{4}-\d{4}$/.test(form.telNumber))"
            :formatter="formatTelNumber"
            maxlength="13"
            placeholder="例:xxx-xxxx-xxxx"
          />
          <BFormInvalidFeedback v-if="form.telNumber">{{
              formatMessage(messages.MSGE015, "電話番号")
            }}</BFormInvalidFeedback>
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

import * as clientApi from "@/api/clientApi.js";
import messages from "@/constants/messages.js";
import Loading from "@/components/Loading.vue";
import * as Auth from "@/utils/auth.js";
import { formatMessage } from "@/utils/messageUtil.js";

const route = useRoute();
const router = useRouter();

// 入力情報
const form = ref({
  clientCode: "",
  clientName: "",
  orderKbn: "1",
  postCode: "",
  address1: "",
  address2: "",
  telNumber: "",
});

// 編集画面かどうか
const isEdit = computed(() => !!route.params.code);

// 受発注区分の一覧
const orderKbnOptions = [
  { value: "1", text: "受注" },
  { value: "2", text: "発注" },
];
// 受発注区分設定値のテキスト
const orderKbnText = computed(() => orderKbnOptions.find((option) => option.value === form.value.orderKbn ?? "").text);

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
    // 一般の場合、登録画面はアクセス不可
    router.push({ name: "top" });
  }

  // 編集画面の場合
  if (isEdit.value) {
    // 取引先詳細取得
    loading.value = true;
    try {
      const clientDetail = await clientApi.getClientByClientCode(route.params.code);
      Object.keys(form.value).forEach((key) => {
        if (key in clientDetail) {
          form.value[key] = clientDetail[key];
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
 * 数字または-のみに置換する
 *
 * @param value 検査値
 */
const formatTelNumber = (value) => {
  return value.replace(/[^0-9-]/g, "");
};

/**
 * 数字のみに置換する
 *
 * @param value 検査値
 */
const formatPostCode = (value) => {
  return value.replace(/[^0-9]/g, "");
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
      await clientApi.updateClient(saveData);
    } else {
      saveData.createdId = loginInfo.userId;
      await clientApi.createClient(saveData);
    }

    // マスタ画面に遷移
    router.push({ name: "clientMaster", state: { message: "登録に成功しました", result: true } });
  } catch (e) {
    showFailedToast.value = 3000;
  } finally {
    loading.value = false;
  }
};
</script>
