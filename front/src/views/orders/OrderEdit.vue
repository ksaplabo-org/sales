<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">
        {{ view.orderKbn === "1" ? "受注情報" : "発注情報" }}
      </h3>
      <BBreadcrumb :items="breadcrumbs" />
    </div>
  </BContainer>

  <!-- 処理失敗トースト -->
  <BToast
    class="w-100"
    v-model="openFailedToast"
    :delay="showFailedToastMs"
    auto-hide
    variant="danger"
    no-progress
    no-close-button
    >{{ messages.MSGE004 }}
  </BToast>

  <!-- 登録情報 -->
  <!-- ヘッダー -->
  <BCard class="shadow-sm mb-3">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <strong>{{ "編集情報" }}</strong>

        <div class="text-end small text-muted">
          <div>最終更新者:{{ view.updatedName }}</div>
          <div>最終更新日:{{ view.updatedAt }}</div>
        </div>
      </div>
    </template>

    <!-- 受発注番号 -->
    <BForm @submit.prevent="updateOrder">
      <BRow class="mb-3">
        <BFormGroup :label="view.orderKbn === '1' ? '受注番号' : '発注番号'" label-cols="3">
          <div class="form-control-plaintext">
            {{ view.orderNo }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 取引先コード -->
      <BRow class="mb-3">
        <BFormGroup label="取引先コード" label-cols="3">
          <div class="form-control-plaintext">
            {{ view.clientCode }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 受発注日 -->
      <BRow class="mb-3">
        <BFormGroup :label="view.orderKbn === '1' ? '受注日' : '発注日'" label-cols="3">
          <div class="form-control-plaintext">
            {{ view.orderDate }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 確定日 -->
      <BRow class="mb-3">
        <BFormGroup :label="view.orderKbn === '1' ? '入金日' : '発注受付完了日'" label-cols="3">
          <!-- 編集画面 かつ 確定日が登録済み -->
          <div v-if="hasConfirmedDate" class="form-control-plaintext">
            {{ view.confirmedDate }}
          </div>

          <!-- 登録画面 または 確定日未登録 -->
          <BFormInput
            v-else
            id="confirmedDate"
            v-model="view.confirmedDate"
            :state="confirmedDateError ? false : true"
            type="date"
          />
          <BFormInvalidFeedback :state="false" v-if="confirmedDateError">
            {{ confirmedDateError }}
          </BFormInvalidFeedback>
        </BFormGroup>
      </BRow>

      <!-- 出荷日 -->
      <BRow class="mb-3" v-if="view.orderKbn === '1'">
        <BFormGroup label="出荷日" label-cols="3">
          <BFormInput id="shipDate" v-model="view.shipDate" :state="shipDateError ? false : true" type="date" />
          <BFormInvalidFeedback :state="false" v-if="shipDateError">
            {{ shipDateError }}
          </BFormInvalidFeedback>
        </BFormGroup>
      </BRow>

      <!-- 納品予定日 -->
      <BRow class="mb-3">
        <BFormGroup label="納品予定日" label-cols="3">
          <BFormInput
            id="deliverDate"
            v-model="view.deliverDate"
            :state="deliverDateError ? false : true"
            type="date"
          />
          <BFormInvalidFeedback :state="false" v-if="deliverDateError">
            {{ deliverDateError }}
          </BFormInvalidFeedback>
        </BFormGroup>
      </BRow>

      <!-- 商品コード -->
      <BRow class="mb-3">
        <BFormGroup label="商品コード" label-cols="3">
          <div class="d-flex gap-2 align-items-start">
            <div class="flex-grow-1">
              <BFormInput
                id="productCode"
                v-model="view.productCode"
                @input="applyProductInput"
                :state="productCodeError ? false : true"
                :formatter="formatHalfWidthAlphaNumeric"
                maxlength="7"
              />

              <BFormInvalidFeedback>
                {{ productCodeError }}
              </BFormInvalidFeedback>
            </div>

            <!-- 商品情報一覧モーダル -->
            <BButton
              type="button"
              variant="outline-primary"
              class="btn-refarence text-nowrap"
              @click="openProductModal"
            >
              <i class="fas fa-list me-1"></i>
              参照
            </BButton>
          </div>
        </BFormGroup>
      </BRow>

      <!-- 商品名 -->
      <BRow class="mb-3">
        <BFormGroup label="商品名" label-cols="3">
          <div class="form-control-plaintext">
            {{ product.productName }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 単価 -->
      <BRow class="mb-3">
        <BFormGroup label="単価" label-cols="3">
          <div class="form-control-plaintext">
            {{ product.productPrice }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 数量 -->
      <BRow class="mb-3">
        <BFormGroup label="数量" label-cols="3">
          <BFormInput
            type="number"
            min="1"
            v-model="view.quantity"
            @blur="applyQuantityInput"
            :formatter="formatHalfWidthNumeric"
            :state="quantityError ? false : true"
          />

          <BFormInvalidFeedback>
            {{ quantityError }}
          </BFormInvalidFeedback>
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

  <!-- 商品情報モーダル -->
  <BModal
    v-model="showProductModal"
    title="商品コードの参照"
    size="lg"
    ok-title="確定"
    cancel-title="キャンセル"
    @ok="applySelectedProductConfirm"
  >
    <BTable
      :items="productItems"
      :fields="productFields"
      striped
      hover
      @row-clicked="applySelectedProduct"
      :tbody-tr-class="rowClass"
    >
    </BTable>
  </BModal>
</template>

<!-- 受発注ボタンレイアウト -->
<style>
.btn-refarence {
  background-color: #fff !important;
  border-color: #007dc5 !important;
  color: #000 !important;
}

.btn-refarence:hover {
  background-color: #0d6efd !important;
  border-color: #4aa8db !important;
  color: #fff !important;
}

.btn-refarence:focus,
.btn-receive:focus-visible {
  box-shadow: 0 0 0 0.25rem rgba(2, 100, 150, 0.25) !important;
}
</style>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import * as orderApi from "@/api/orderApi.js";
import Loading from "@/components/Loading.vue";
import * as Auth from "@/utils/auth.js";
import messages from "@/constants/messages.js";
import * as productApi from "@/api/productApi.js";

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
 * 半角英数のみに置換する
 *
 * @param value 検査値
 */
const formatHalfWidthAlphaNumeric = (value) => {
  return value.replace(/[^A-Za-z0-9]/g, "");
};

//ルート情報取得
const route = useRoute();
const router = useRouter();

// ログイン情報
const loginInfo = Auth.getLoginInfo();

//ref
//処理失敗トースト表示
const openFailedToast = ref(false);
const TOAST_MS = 1500;
const showFailedToastMs = ref(TOAST_MS);

// ローディング表示
const loading = ref(false);

// 入力情報
const view = ref({
  orderNo: "",
  orderKbn: "",
  clientCode: "",
  orderDate: "",
  confirmedDate: "",
  shipDate: "",
  deliverDate: "",
  productCode: "",
  orderClientCode: "",
  quantity: "",
  updatedName: "",
  updatedAt: "",
});

const product = ref({
  productName: "-",
  productPrice: "-",
});

// 確定日登録判定入力制御処理
const hasConfirmedDate = ref(false);

//商品情報モーダル
const showProductModal = ref(false);
const selectedProduct = ref(null);

//商品情報一覧検索結果
const productItems = ref([]);

//computed
//エラーメッセージラベル
const orderDateLabel = computed(() => (view.value.orderKbn === "1" ? "受注日" : "発注日"));
const confirmedDateLabel = computed(() => (view.value.orderKbn === "1" ? "入金日" : "発注受付完了日"));

//確定日エラーメッセージ
const confirmedDateError = computed(() => {
  const orderDate = view.value.orderDate;
  const confirmedDate = view.value.confirmedDate;

  if (!confirmedDate) {
    return "";
  }

  if (new Date(confirmedDate) < new Date(orderDate)) {
    return `${confirmedDateLabel.value}は${orderDateLabel.value}以降の日付を入力してください。`;
  }
  return "";
});

//出荷日エラーメッセージ
const shipDateError = computed(() => {
  const orderDate = view.value.orderDate;
  const confirmedDate = view.value.confirmedDate;
  const shipDate = view.value.shipDate;

  if (!shipDate) {
    return "";
  }
  if (new Date(shipDate) < new Date(confirmedDate)) {
    return `出荷日は${confirmedDateLabel.value}以降の日付を入力してください。`;
  }
  if (new Date(shipDate) < new Date(orderDate)) {
    return `出荷日は${orderDateLabel.value}以降の日付を入力してください。`;
  }
  return "";
});

//納品予定日エラーメッセージ
const deliverDateError = computed(() => {
  const orderDate = view.value.orderDate;
  const confirmedDate = view.value.confirmedDate;
  const shipDate = view.value.shipDate;
  const deliverDate = view.value.deliverDate;

  if (!deliverDate) {
    return "";
  }

  if (view.value.orderKbn === "1") {
    if (new Date(deliverDate) < new Date(shipDate)) {
      return "納品予定日は出荷日以降の日付を入力してください。";
    }
  }

  if (view.value.orderKbn === "2") {
    if (new Date(deliverDate) < new Date(confirmedDate)) {
      return "納品予定日は発注受付完了日以降の日付を入力してください。";
    }
    if (new Date(deliverDate) < new Date(orderDate)) {
      return "納品予定日は発注日以降の日付を入力してください。";
    }
  }
  return "";
});

//商品コードエラーメッセージ
const productCodeError = computed(() => {
  // 未入力
  if (!view.value.productCode) {
    return "商品コードを入力してください。";
  }
  // 桁数チェック
  if (view.value.productCode.length !== 7) {
    return "商品コードは7桁で入力してください。";
  }
  //形式チェック
  if (!/^[A-Za-z0-9]+$/.test(view.value.productCode)) {
    return "商品コードは半角英数で入力してください。";
  }
  // 存在チェック
  if (product.value.productName === "-") {
    return "存在しない商品コードです。";
  }
  return "";
});

//数量エラーメッセージ
const quantityError = computed(() => {
  // 未入力チェック
  if (view.value.quantity === "" || view.value.quantity === null || view.value.quantity === undefined) {
    return "数量を入力してください。";
  }
  // 1以上チェック
  if (Number(view.value.quantity) < 1) {
    return "数量は1以上で入力してください。";
  }
  return "";
});

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
    text: view.value.orderKbn === "1" ? "受注情報編集" : "発注情報編集",
    active: true,
  },
]);

//商品情報一覧列定義
const productFields = computed(() => {
  const fields = [
    {
      key: "productCode",
      label: "商品コード",
      sortable: true,
    },
    {
      key: "productName",
      label: "商品名",
    },
  ];

  if (view.value.orderKbn === "2") {
    fields.push({
      key: "orderClientCode",
      label: "発注先コード",
    });
  }

  fields.push({
    key: "productPrice",
    label: "単価",
  });

  return fields;
});

//モーダルを開く
const openProductModal = () => {
  showProductModal.value = true;
};

//商品選択行保持
const applySelectedProduct = (row) => {
  selectedProduct.value = row.item;
};

// 商品選択内容確定処理
const applySelectedProductConfirm = () => {
  if (!selectedProduct.value) {
    return;
  }
  view.value.productCode = selectedProduct.value.productCode;
  product.value.productName = selectedProduct.value.productName;
  product.value.productPrice = selectedProduct.value.productPrice;
  showProductModal.value = false;
};

//商品情報入力反映処理
const applyProductInput = () => {
  const item = productItems.value.find((p) => p.productCode === view.value.productCode);

  if (item) {
    product.value.productName = item.productName;
    product.value.productPrice = item.productPrice;
  } else {
    product.value.productName = "-";
    product.value.productPrice = "-";
  }
};

const applyQuantityInput = () => {
  view.value.quantity = formatHalfWidthNumeric(String(view.value.quantity ?? ""));
};

//選択商品行をハイライト表示
const rowClass = (item) => {
  if (!item) return "";

  return selectedProduct.value?.productCode === item.productCode ? "table-primary" : "";
};

//初期表示処理
onMounted(async () => {
  try {
    if (loginInfo.role === "2") {
      router.push({ name: "top" });
      return;
    }

    loading.value = true;

    const orderInfo = await orderApi.getOrderByOrderNo(route.params.orderNo);

    Object.assign(view.value, orderInfo);

    if (view.value.updatedAt) {
      view.value.updatedAt = view.value.updatedAt.substring(0, 10).replace(/-/g, "/");
    }

    // 初期表示時の状態を保持
    hasConfirmedDate.value = !!orderInfo.confirmedDate;

    const products = await productApi.getProducts({
      orderKbn: orderInfo.orderKbn,
    });
    productItems.value = products;

    if (view.value.productCode) {
      const productInfo = await productApi.getProductByProductCode(view.value.productCode);
      product.value.productName = productInfo.productName;
      product.value.productPrice = productInfo.productPrice;
    }
  } catch (e) {
    console.error(e);
    openFailedToast.value = true;
  } finally {
    loading.value = false;
  }
});

//更新
const updateOrder = async () => {
  if (
    confirmedDateError.value ||
    deliverDateError.value ||
    productCodeError.value ||
    quantityError.value ||
    (view.value.orderKbn === "1" && shipDateError.value)
  ) {
    openFailedToast.value = true;
    setTimeout(() => {
      openFailedToast.value = false;
    }, 1500);
    return;
  }
  loading.value = true;

  try {
    const saveData = {
      orderNo: view.value.orderNo,
      confirmedDate: view.value.confirmedDate,
      deliverDate: view.value.deliverDate,
      productCode: view.value.productCode,
      quantity: view.value.quantity,
      updatedId: loginInfo.userId,
    };

    if (view.value.orderKbn === "1") {
      saveData.shipDate = view.value.shipDate;
    }

    await orderApi.editOrder(saveData);

    router.push({
      name: "orderSales",
      state: {
        result: true,
        message: "更新に成功しました。",
      },
    });
  } catch (error) {
    openFailedToast.value = true;
  } finally {
    loading.value = false;
  }
};
</script>
