<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">
        {{ isReceive ? "受注情報" : "発注情報" }}
      </h3>
      <BBreadcrumb :items="breadcrumbs" />
    </div>
  </BContainer>

  <!-- 処理失敗トースト -->
  <BToast class="w-100" v-model="showFailedToast" variant="danger" no-progress no-close-button>{{
    messages.MSGE004
  }}</BToast>

  <!-- 登録情報 -->
  <!-- ヘッダー -->
  <BCard class="shadow-sm mb-3">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <strong>{{ isEdit ? "編集情報" : "登録情報" }}</strong>

        <div v-if="isEdit" class="text-end small text-muted">
          <div>最終更新者:{{ form.updatedName }}</div>
          <div>最終更新日:{{ formatDate(form.updatedAt) }}</div>
        </div>
      </div>
    </template>

    <!-- 受発注番号 -->
    <BForm @submit.prevent="save">
      <BRow class="mb-3">
        <BFormGroup :label="isReceive ? '受注番号' : '発注番号'" label-cols="3">
          <div v-if="!isEdit">
            <BFormInput
              id="orderNo"
              v-model="form.orderNo"
              :state="orderNoState"
              maxlength="8"
              @input="form.orderNo = toHalfAlphaNumeric(form.orderNo)"
              required
            />
          </div>
          <div v-else class="form-control-plaintext">
            {{ form.orderNo }}
          </div>
        </BFormGroup>
      </BRow>

<!-- 取引先コード -->
      <BRow class="mb-3">
        <BFormGroup label="取引先コード" label-cols="3">
          <div v-if="!isEdit">
            <BFormInput
              id="clientCode"
              v-model="form.clientCode"
              :state="clientCodeState"
              maxlength="8"
              @input="form.clientCode = toHalfAlphaNumeric(form.clientCode)"
              required
            />
          </div>
          <div v-else class="form-control-plaintext">
            {{ form.clientCode }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 取引先名 -->
      <BRow class="mb-3" v-if="!isEdit">
        <BFormGroup label="取引先名" label-cols="3">
          <div class="form-control-plaintext">
            {{ form.clientName }}
          </div>
        </BFormGroup>
      </BRow>

<!-- 電話番号 -->
      <BRow class="mb-3" v-if="!isEdit">
        <BFormGroup label="電話番号" label-cols="3">
          <div class="form-control-plaintext">
            {{ form.telNumber }}
          </div>
        </BFormGroup>
      </BRow>
      
<!-- 住所１ -->
      <BRow class="mb-3" v-if="!isEdit">
        <BFormGroup label="住所1" label-cols="3">
          <div class="form-control-plaintext">
            {{ form.address1 }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 受発注日 -->
      <BRow class="mb-3">
        <BFormGroup :label="isReceive ? '受注日' : '発注日'" label-cols="3">
          <div v-if="!isEdit">
            <BFormInput
              id="orderDate"
              v-model="form.orderDate"
              :state="dateState(form.orderDate)"
              type="date"
              required
            />
          </div>
          <div v-else class="form-control-plaintext">
            {{ form.orderDate }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 確定日 -->
      <BRow class="mb-3">
        <BFormGroup :label="isReceive ? '入金日' : '発注受付完了日'" label-cols="3">

          <!-- 編集画面 かつ 確定日が登録済み -->
          <div v-if="isEdit && hasConfirmedDate" class="form-control-plaintext">
            {{ form.confirmedDate }}
          </div>

          <!-- 登録画面 または 確定日未登録 -->
          <BFormInput v-else 
          id="confirmedDate" 
          v-model="form.confirmedDate" 
          :state="confirmedDateState" 
          type="date" 
          />
        </BFormGroup>
      </BRow>

      <!-- 出荷日 -->
      <BRow class="mb-3" v-if="isReceive">
        <BFormGroup label="出荷日" label-cols="3">
          <BFormInput id="shipDate" v-model="form.shipDate" :state="dateState(form.shipDate)" type="date" required />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="納品予定日" label-cols="3">
          <div v-if="isEdit">
            <BFormInput id="deliverDate" v-model="form.deliverDate" :state="deliverDateState" type="date" />
          </div>
          <div v-else>
            <BFormInput
              id="deliverDate"
              v-model="form.deliverDate"
              :state="dateState(form.deliverDate)"
              type="date"
              required
            />
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="商品コード" label-cols="3">
          <BFormInput
            id="productCode"
            v-model="form.productCode"
            :state="productCodeState"
            maxlength="7"
            @input="form.productCode = toHalfAlphaNumeric(form.productCode)"
            required
          />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="商品名" label-cols="3">
          <div class="form-control-plaintext">
            {{ form.productName }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="単価" label-cols="3">
          <div class="form-control-plaintext">
            {{ form.productPrice }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="数量" label-cols="3">
          <BFormInput type="number" min="1" v-model="form.quantity" :state="quantityState" />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3" v-if="!isEdit">
        <BFormGroup label="金額" label-cols="3">
          <div class="form-control-plaintext">
            {{ form.amount }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3" v-if="!isEdit">
        <BFormGroup label="消費税" label-cols="3">
          <div class="form-control-plaintext">
            {{ form.tax }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3" v-if="!isEdit">
        <BFormGroup label="請求金額" label-cols="3">
          <div class="form-control-plaintext">
            {{ form.amountTaxIncluded }}
          </div>
        </BFormGroup>
      </BRow>

      <div v-if="isEdit" class="d-flex justify-content-center">
        <BButton type="submit" variant="primary">
          <i class="fas fa-save"></i>
          編集
        </BButton>
      </div>
      <div v-else class="d-flex justify-content-center">
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

import * as orderApi from "@/api/orderApi.js";
import Loading from "@/components/Loading.vue";
import * as Auth from "@/utils/auth.js";
import messages from "@/constants/messages.js";
// import * as productApi from "@/api/productApi.js";
// import * as orderApi from "@/api/clientApi.js";

const route = useRoute();
const router = useRouter();
const showFailedToast = ref(false);

// ログイン情報
const loginInfo = Auth.getLoginInfo();

//登録の受発注判定
const isReceive = route.name === "orderReceiveCreate";

//最終更新日フォーマット
const formatDate = (date) => {
  if (!date) return "";
  return date.substring(0, 10).replace(/-/g, "/");
};

const dateState = (value) => {
  return value ? true : false;
};

//受発注番号フォーマット
const orderNoState = computed(() => {
  return /^[A-Za-z0-9]{8}$/.test(form.value.orderNo);
});

//取引先コードフォーマット
const clientCodeState = computed(() => {
  return /^[A-Za-z0-9]{8}$/.test(form.value.clientCode);
});

//商品コードフォーマット
const productCodeState = computed(() => {
  return /^[A-Za-z0-9]{7}$/.test(form.value.productCode);
});

// 初期表示時に確定日が登録済みだったか
const hasConfirmedDate = ref(false);

//確定日フォーマット
const confirmedDateState = computed(() => {
  if (!form.value.confirmedDate) {
    return null;
  }
  return !isNaN(new Date(form.value.confirmedDate).getTime());
});

//納品予定日フォーマット
const deliverDateState = computed(() => {
  if (!form.value.deliverDate) {
    return null;
  }
  return !isNaN(new Date(form.value.deliverDate).getTime());
});

//数量
const quantityState = computed(() => {
  return (
    form.value.quantity !== "" &&
    form.value.quantity !== null &&
    form.value.quantity !== undefined &&
    Number(form.value.quantity) >= 1
  );
});

//半角英数字
const toHalfAlphaNumeric = (value) => {
  return value.replace(/[^A-Za-z0-9]/g, "");
};

// ローディング表示
const loading = ref(false);

// 入力情報
const form = ref({
  orderNo: "",
  orderKbn: "",
  clientCode: "",
  clientName: "",
  telNumber: "",
  address1: "",
  orderDate: "",
  confirmedDate: "",
  shipDate: "",
  deliverDate: "",
  productCode: "",
  productPrice: "",
  productName: "",
  quantity: "",
  amount: "",
  tax: "",
  amountTaxIncluded: "",
  updatedName: "",
  updatedAt: "",
});

//商品名・単価取得
// watch(
//   () => form.value.productCode,
//   async (productCode) => {
//     if (!productCode) {
//       return;
//     }

//     try {
//       const product = await productApi.getProductByCode(productCode);

//       form.value.productName = product.productName;

//       form.value.unitPrice = product.unitPrice;
//     } catch {
//       form.value.productName = "-";
//       form.value.unitPrice = "-";
//     }
//   },
// );

// パンくずリスト
const breadcrumbs = computed(() => [
  {
    text: "トップページ",
    to: "/",
  },
  {
    text: "受発注情報一覧",
    to: {
      name: "orderSales",
    },
  },
  {
    text:
      isReceiveCreate
        ? isEdit.value
          ? "受注情報編集"
          : "受注情報登録"
        : isEdit.value
          ? "発注情報編集"
          : "発注情報登録",
    active: true,
  },
]);

/**
 * 初期表示処理
 */
onMounted(async () => {
  if (isReceive.value) {
    form.value.orderKbn = "1";
  }
  if (isSale.value) {
    form.value.orderKbn = "2";
  }

  try {
    loading.value = true;
    // 編集画面の場合
    if (isEdit.value) {
      const orderInfo = await orderApi.getOrderByOrderId(route.params.orderNo);
      Object.assign(form.value, orderInfo);

      // 初期表示時の状態を保持
      hasConfirmedDate.value = !!orderInfo.confirmedDate;

      console.log(form.value);
    }
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
});

/**
 * 戻る
 */
const back = () => {
  router.push({
    name: "orderSales",
  });
};

/**
 * 登録・更新
 */
const save = async () => {
  loading.value = true;

  try {
    const saveData = {
      ...form.value,
    };

    saveData.amount = 0;
    saveData.tax = 0;
    saveData.amountTaxIncluded = 0;

    // 更新
    if (isEdit.value) {
      saveData.updatedId = loginInfo.userId;

      console.log(saveData);

      await orderApi.editOrder(saveData);
    }
    // 登録
    else {
      saveData.createdId = loginInfo.userId;

      await orderApi.createOrder(saveData);
    }

    router.push({
      name: "orderSales",
      state: {
        result: true,
        message: isEdit.value ? "更新に成功しました。" : "登録に成功しました。",
      },
    });
  } catch (e) {
    console.error(e);
    console.error(e.response?.data);
    console.error(e.response?.data.errors);
  } finally {
    loading.value = false;
  }
};
</script>
