<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">商品登録</h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/' },
          { text: '商品マスタ', to: { name: 'productMaster' } },
          { text: '商品登録', active: true }
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
        <BFormGroup label="商品コード" label-for="productCode" label-cols="3">
          <div v-if="!isEdit">
            <BFormInput
              id="productCode"
              v-model="form.productCode"
              :state="form.productCode.length === 7"
              :formatter="formatHalfWidthAlphaNumeric"
              maxlength="7"
              required
            />
            <BFormInvalidFeedback v-if="form.productCode">{{
              formatMessage(messages.MSGE008, "商品コード", 7)
            }}</BFormInvalidFeedback>
          </div>
          <div v-else class="form-control-plaintext">
            {{ form.productCode }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="受発注区分" label-for="orderKbn" label-cols="3">
          <BFormRadioGroup
            v-if="!isEdit"
            v-model="form.orderKbn"
            :options="orderKbnOptions"
            inline
            :required
            @change="handleOrderKbnChange"
          />
          <span v-else>
            {{ orderKbnOptions.find((option) => option.value === form.orderKbn)?.text }}
          </span>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="発注先コード" label-for="orderClientCode" label-cols="3">
          <!--
            ・編集時の受注は発注先コードを保持しないため「-」を表示
            ・新規登録時の受注は発注先コード欄を非活性表示
            ・発注の場合は発注先候補が存在する場合のみ選択可能
          -->
          <div v-if="form.orderKbn === '1' && isEdit">-</div>
          <BFormSelect
            v-else-if="isEdit || form.orderKbn === '1' || orderClientOptions.length > 0"
            v-model="form.orderClientCode"
            :options="orderClientOptions"
            :disabled="form.orderKbn === '1'"
          />
          <div v-else class="text-danger">
            {{ formatMessage(messages.MSGE018, "発注先コード") }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="商品名" label-for="productName" label-cols="3">
          <BFormInput
            id="productName"
            type="text"
            v-model="form.productName"
            :state="form.productName.length > 0 && form.productName.length <= 20"
            maxlength="20"
            required
          />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="単価" label-for="productPrice" label-cols="3">
          <BFormInput
            id="productPrice"
            type="number"
            min="1"
            v-model="form.productPrice"
            :state="form.productPrice > 0"
            :formatter="formatHalfWidthNumeric"
            required
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
import messages from "@/constants/messages.js";
import Loading from "@/components/Loading.vue";
import * as Auth from "@/utils/auth.js";
import { formatMessage } from "@/utils/messageUtil.js";

const route = useRoute();
const router = useRouter();

// 入力情報
const form = ref({
  productCode: "",
  orderKbn: "1",
  orderClientCode: "",
  productName: "",
  productPrice: null
});

// 編集画面かどうか
const isEdit = computed(() => !!route.params.productCode);

// 読み込み中の表示制御
const loading = ref(false);

//トースト表示ミリ秒
const TOAST_MS = 1500;

// 処理失敗トーストの表示制御
const failedToastText = ref("");
const showFailedToastMs = ref(0);

// ログイン情報
const loginInfo = Auth.getLoginInfo();
//受発注区分表示
const orderKbnOptions = [
  { value: "1", text: "受注" },
  { value: "2", text: "発注" }
];
//発注先コードの一覧
const orderClientOptions = ref([]);
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
      const productInfo = await productApi.getProductByProductCode(route.params.productCode);
      Object.keys(form.value).forEach((key) => {
        form.value[key] = productInfo[key];
      });
    } catch (e) {
      console.log(e);
      showFailedToast(messages.MSGE001);
    }
  }

  //取引先情報一覧取得
  try {
    const clients = await clientApi.getClients({ orderKbn: "2" });

    orderClientOptions.value = clients
      .sort((a, b) => a.clientCode.localeCompare(b.clientCode))
      .map((client) => ({
        value: client.clientCode,
        text: `${client.clientCode} : ${client.clientName}`
      }));
  } catch (e) {
    console.log(e);
    showFailedToast(messages.MSGE001);
  }
  loading.value = false;
});

/**
 * 登録処理
 */
const save = async () => {
  loading.value = true;
  try {
    if (isEdit.value) {
      form.value.updatedId = loginInfo.userId;
      await productApi.updateProduct(form.value);
    } else {
      form.value.createdId = loginInfo.userId;
      await productApi.createProduct(form.value);
    }

    // マスタ画面に遷移
    router.push({
      name: "productMaster",
      state: { message: messages.MSGI003, result: true }
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
 * 半角英数のみに置換
 *
 * @param value 検査値
 */
const formatHalfWidthAlphaNumeric = (value) => {
  return value.replace(/[^A-Za-z0-9]/g, "");
};

/**
 * 半角数字のみに置換する
 *
 * @param value 検査値
 */
const formatHalfWidthNumeric = (value) => {
  const result = value.replace(/[^0-9]/g, "");
  return result === "" ? "" : Number(result);
};

/**
 * 受発注区分変更時の処理
 */
const handleOrderKbnChange = () => {
  if (form.value.orderKbn === "1") {
    form.value.orderClientCode = "";
  } else if (form.value.orderKbn === "2" && orderClientOptions.value.length > 0) {
    form.value.orderClientCode = orderClientOptions.value[0].value;
  }
};
</script>
