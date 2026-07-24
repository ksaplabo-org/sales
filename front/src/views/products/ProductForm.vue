<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">商品登録</h3>
      <BBreadcrumb :items="breadcrumbs" />
    </div>
  </BContainer>

  <!-- 処理失敗トースト -->
  <BToast class="w-100"
    v-model="showFailedToastMs"
    variant="danger"
    no-progress
    no-close-button
    >{{ failedToastText }}</BToast
  >

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
              code="productCode"
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
            :options="[
              { value: '1', text: '受注' },
              { value: '2', text: '発注' },
            ]"
            inline
            :required
          />
          <span v-else>
            {{ form.orderKbn === "1" ? "受注" : "発注" }}
          </span>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup
          label="発注先コード"
          label-for="orderClientCode"
          label-cols="3"
        >
          <B-form-select
            v-if="!showClientMessage"
            v-model="form.orderClientCode"
            :options="orderClientOptions"
            :disabled="form.orderKbn === '1'"
          />
          <div v-else class="text-danger">
            {{ showClientMessage }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="商品名" label-for="productName" label-cols="3">
          <BFormInput
            id="productName"
            type="productName"
            v-model="form.productName"
            :state="
              form.productName.length > 0 && form.productName.length <= 20
            "
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
            v-model="form.productPrice"
            :state="
              form.productPrice.length > 0 && /^[0-9]+$/.test(form.productPrice)
            "
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
  productPrice: "",
});

// 編集画面かどうか
const isEdit = computed(() => !!route.params.code);

// パンくずリスト
const breadcrumbs = computed(() => {
  // 商品マスタ画面から遷移
  return [
    { text: "トップページ", to: "/" },
    { text: "商品マスタ", to: { name: "productMaster" } },
    { text: "商品登録", active: true },
  ];
});

// 読み込み中の表示制御
const loading = ref(false);

//トースト表示ミリ秒
const TOAST_MS = 1500;

// 処理失敗トーストの表示制御
const failedToastText = ref("");
const showFailedToastMs = ref(0);

// ログイン情報
const loginInfo = Auth.getLoginInfo();
/**
 * 初期表示時処理
 */
onMounted(async () => {
  // 一般の場合
  if (loginInfo.role === "1") {
    router.push({ name: "top" });
  }

  // 編集画面の場合

  if (isEdit.value) {
    // 商品情報詳細取得
    loading.value = true;

    let productInfo;

    try {
      const productInfo = await productApi.getProductByProductCode(
        route.params.code,
      );
    } catch (e) {
      console.log(e);
      openFailedToast(messages.MSGE001);
      loading.value = false;
      return;
    }
  }

  //取引先情報一覧取得
  const getClientList = async () => {
    try {
      const clientList = await clientApi.getClients("2");
      //0件チェック
      if (clientList.length === 0) {
        showClientMessage.value = formatMessage(MSGE018, "発注先コード");
        return;
      }
      orderClientOptions.value = clientList
        .filter((client) => client.orderKbn === "2")
        .sort((a, b) => a.clientCode.localeCompare(b.clientCode))
        .map((client) => ({
          value: client.clientCode,
          text: client.clientName,
        }));

      //フォームの初期化(編集画面にて必要)
      Object.keys(form.value).forEach((key) => {
        if (key in productInfo) {
          form.value[key] = productInfo[key];
        }
      });
    } catch (e) {
      console.log(e);
      openFailedToast(messages.MSGE001);
    } finally {
      loading.value = false;
    }
  };
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
      await productApi.editProduct(saveData);
    } else {
      saveData.createdId = loginInfo.userId;
      await productApi.createProduct(saveData);
    }

    // マスタ画面に遷移
    router.push({
      name: "productMaster",
      state: { message: "登録に成功しました", result: true },
    });
  } catch (e) {
    openFailedToast(messages.MSGE001);
  } finally {
    loading.value = false;
  }
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
