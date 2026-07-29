<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">
        {{
          isReceiveCreate || isReceiveOrder
            ? isEdit
              ? "受注情報編集"
              : "受注情報登録"
            : isEdit
              ? "発注情報編集"
              : "発注情報登録"
        }}
      </h3>
      <BBreadcrumb :items="breadcrumbs" />
    </div>
  </BContainer>

  <!-- 処理失敗トースト -->
  <!-- <BToast class="w-100" v-model="showFailedToast" variant="danger" no-progress no-close-button>{{
    messages.MSGE004
  }}</BToast> -->

  <!-- 登録情報 -->
  <BCard class="shadow-sm mb-3">
    <template #header>
      <strong>{{ isEdit ? "編集情報" : "登録情報" }}</strong>
    </template>

    <BForm @submit.prevent="save">
      <BRow class="mb-3">
        <BFormGroup :label="isReceive ? '受注番号' : '発注番号'" label-cols="3">
          <div class="form-control-plaintext">
            {{ form.orderNo }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="取引先コード" label-cols="3">
          <div class="form-control-plaintext">
            {{ form.clientCode }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup :label="isReceive ? '受注日' : '発注日'" label-cols="3">
          <div class="form-control-plaintext">
            {{ form.orderDate }}
          </div>
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup :label="isReceive ? '入金日' : '発注受付完了日'" label-cols="3">
          <BFormInput type="date" v-model="form.confirmedDate" />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="出荷日" label-cols="3">
          <BFormInput type="date" v-model="form.shipDate" />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="納品予定日" label-cols="3">
          <BFormInput type="date" v-model="form.deliverDate" />
        </BFormGroup>
      </BRow>

      <BRow class="mb-3">
        <BFormGroup label="商品コード" label-cols="3">
          <BFormInput v-model="form.productCode" />
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
          <BFormInput type="number" min="1" v-model="form.quantity" />
        </BFormGroup>
      </BRow>
      <div class="d-flex justify-content-center">
        <BButton type="submit" variant="primary">
          <i class="fas fa-save"></i>
          編集
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

// 編集画面判定
const isEdit = computed(() => !!route.params.id);

//登録の受発注判定
const isReceiveCreate = route.name === "orderReceiveCreate";
const isSaleCreate = route.name === "orderSaleCreate";

//編集の受発注判定
const isReceiveOrder = computed(() => route.name === "orderReceiveEdit");
const isSaleOrder = computed(() => route.name === "orderSaleEdit");

const isReceive = computed(() => isReceiveCreate || isReceiveOrder.value);

const isSale = computed(() => isSaleCreate || isSaleOrder.value);

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
  quantity: "",
  amount: "",
  tax: "",
  amountTaxIncluded: "",
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
      isReceiveCreate || isReceiveOrder.value
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
  if (isReceive) {
    form.value.orderKbn = "1";
  }
  if (isSale) {
    form.value.orderKbn = "2";
  }

  try {
    loading.value = true;
    // 編集画面の場合
    if (isEdit.value) {
      const orderInfo = await orderApi.getOrderByOrderId(route.params.id);
      Object.assign(form.value, orderInfo);
    }

    // 

    
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

    // 更新
    if (isEdit.value) {
      saveData.updatedId = loginInfo.userId;

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
    console.log(e);
  } finally {
    loading.value = false;
  }
};
</script>
