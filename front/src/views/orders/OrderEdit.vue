<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">
        {{ view.orderKbn === "1" ? "受注情報" : view.orderKbn === "2" ? "発注情報" : "" }}
      </h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/' },
          { text: '受発注情報一覧', to: '/' },
          {
            text: view.orderKbn === '1' ? '受注情報編集' : view.orderKbn === '2' ? '発注情報編集' : '',
            active: true,
          },
        ]"
      />
    </div>
  </BContainer>

  <!-- 処理失敗トースト -->
  <BToast class="w-100" v-model="showFailedToastMs" variant="danger" no-progress>{{ failedToastText }}</BToast>

  <!-- 登録情報 -->
  <BCard class="shadow-sm mb-3">
    <!-- ヘッダー -->
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <strong>{{ "編集情報" }}</strong>

        <div class="small text-muted">
          <div>最終更新者:{{ view.updatedName }}</div>
          <div>最終更新日:{{ view.updatedAt }}</div>
        </div>
      </div>
    </template>

    <!-- 受発注番号 -->
    <BForm @submit.prevent="updateOrder">
      <BRow class="mb-3">
        <BFormGroup
          :label="view.orderKbn === '1' ? '受注番号' : view.orderKbn === '2' ? '発注番号' : ''"
          label-cols="3"
        >
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
        <BFormGroup :label="view.orderKbn === '1' ? '受注日' : view.orderKbn === '2' ? '発注日' : ''" label-cols="3">
          <div class="form-control-plaintext">
            {{ view.orderDate }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 確定日 -->
      <BRow class="mb-3">
        <BFormGroup
          :label="view.orderKbn === '1' ? '入金日' : view.orderKbn === '2' ? '発注受付完了日' : ''"
          label-cols="3"
        >
          <!-- 編集画面 かつ 確定日が登録済み -->
          <div v-if="hasConfirmedDate" class="form-control-plaintext">
            {{ view.confirmedDate }}
          </div>

          <!-- 確定日未登録 -->
          <BFormInput
            v-else
            id="confirmedDate"
            v-model="view.confirmedDate"
            :state="isValidConfirmedDate()"
            type="date"
          />
          <div v-if="showConfirmedDateError()" class="text-danger">
            {{
              formatMessage(
                messages.MSGE017,
                view.orderKbn === "1" ? "入金日" : view.orderKbn === "2" ? "発注受付完了日" : "",
                view.orderKbn === "1" ? "受注日" : view.orderKbn === "2" ? "発注日" : "",
              )
            }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 出荷日 -->
      <BRow class="mb-3" v-if="view.orderKbn === '1'">
        <BFormGroup label="出荷日" label-cols="3">
          <BFormInput id="shipDate" v-model="view.shipDate" :state="isValidShipDate()" type="date" />
          <div v-if="showShipDateError()" class="text-danger">
            {{ formatMessage(messages.MSGE017, "出荷日", view.confirmedDate ? "入金日" : "受注日") }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 納品予定日 -->
      <BRow class="mb-3">
        <BFormGroup label="納品予定日" label-cols="3">
          <BFormInput id="deliverDate" v-model="view.deliverDate" :state="isValidDeliverDate()" type="date" />
          <div v-if="showDeliverDateError()" class="text-danger">
            {{ formatMessage(messages.MSGE017, "納品予定日", getDeliverDateBaseLabel()) }}
          </div>
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
                :state="!view.productCode ? null : view.productCode.length === 7 && product.productName !== null"
                :formatter="formatHalfWidthAlphaNumeric"
                maxlength="7"
                @input="
                  product.productName = '-';
                  product.productPrice = `-`;
                "
                @blur="applyProductInput(view.productCode)"
              />

              <div v-if="view.productCode.length === 7 && product.productName === null" class="text-danger">
                {{ formatMessage(messages.MSGE019, "商品コード") }}
              </div>
            </div>

            <!-- 商品情報一覧モーダル -->
            <BButton variant="outline-primary" class="text-dark" @click="openProductModal">
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
            {{ product.productPrice == null ? "" : product.productPrice.toLocaleString("ja-JP") }}
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
            :formatter="formatHalfWidthNumeric"
            :state="Number(view.quantity) >= 1"
          />

          <div v-if="view.quantity !== '' && view.quantity !== null && Number(view.quantity) < 1" class="text-danger">
            {{ formatMessage(messages.MSGE016, "数量", 1) }}
          </div>
        </BFormGroup>

        <!-- 編集ボタン -->
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
  <BModal v-model="showProductModal" title="商品コードの参照" size="lg">
    <BTable
      :items="productItems"
      :fields="productFields"
      hover
      selectable
      select-mode="single"
      @row-selected="onProductSelected"
    />
    <div v-if="productItems.length === 0" class="text-center text-muted mt-3">検索結果がありません</div>
    <template #footer>
      <BButton variant="secondary" @click="selectedProduct = null; showProductModal = false;">キャンセル</BButton>
      <BButton variant="primary" @click="applySelectedProduct">確定</BButton>
    </template>
  </BModal>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import * as orderApi from "@/api/orderApi.js";
import Loading from "@/components/Loading.vue";
import * as Auth from "@/utils/auth.js";
import messages from "@/constants/messages.js";
import * as productApi from "@/api/productApi.js";
import { formatMessage } from "@/utils/messageUtil.js";

//ルート情報取得
const route = useRoute();
const router = useRouter();

// ログイン情報
const loginInfo = Auth.getLoginInfo();

//処理失敗トースト表示
const failedToastText = ref("");
const showFailedToastMs = ref(0);
const TOAST_MS = 1500;

// ローディング表示
const loading = ref(false);

// 表示項目
const view = ref({
  orderNo: "",
  clientCode: "",
  orderDate: "",
  confirmedDate: "",
  shipDate: "",
  deliverDate: "",
  productCode: "",
  quantity: null,
  updatedName: "",
  updatedAt: "",
});
const product = ref({
  productName: "",
  productPrice: null,
});

// 確定日登録判定入力制御処理
const hasConfirmedDate = ref(false);

//モーダル表示制御
const showProductModal = ref(false);

//参照行選択
const selectedProduct = ref(null);

//一覧検索結果
const productItems = ref([]);

const productFields = [
  { key: "productCode", label: "商品コード", sortable: true },
  { key: "productName", label: "商品名" },
  ...(view.value.orderKbn === "2" ? [{ key: "orderClientCode", label: "発注先コード" }] : []),
  { key: "productPrice", label: "単価" },
];

//確定日入力チェック
const isValidConfirmedDate = () => {
  return !view.value.confirmedDate || view.value.confirmedDate >= view.value.orderDate;
};

//出荷日入力チェック
const isValidShipDate = () => {
  if (!view.value.shipDate) {
    return true;
  }

  if (view.value.confirmedDate) {
    return view.value.shipDate >= view.value.confirmedDate;
  }

  return view.value.shipDate >= view.value.orderDate;
};

//納品予定日入力チェック
const isValidDeliverDate = () => {
  if (!view.value.deliverDate) {
    return true;
  }

  if (view.value.orderKbn === "1") {
    return view.value.shipDate
      ? view.value.deliverDate >= view.value.shipDate
      : view.value.deliverDate >= view.value.orderDate;
  }

  return view.value.confirmedDate
    ? view.value.deliverDate >= view.value.confirmedDate
    : view.value.deliverDate >= view.value.orderDate;
};

const showShipDateError = () => {
  if (view.value.confirmedDate && view.value.confirmedDate < view.value.orderDate) {
    return false;
  }

  if (!view.value.shipDate) {
    return false;
  }

  return view.value.confirmedDate
    ? view.value.shipDate < view.value.confirmedDate
    : view.value.shipDate < view.value.orderDate;
};

const showDeliverDateError = () => {
  // 確定日エラー表示中なら納品予定日のエラーは表示しない
  if (view.value.confirmedDate && view.value.confirmedDate < view.value.orderDate) {
    return false;
  }

  // 出荷日エラー表示中なら納品予定日のエラーは表示しない
  if (
    view.value.shipDate &&
    (view.value.confirmedDate
      ? view.value.shipDate < view.value.confirmedDate
      : view.value.shipDate < view.value.orderDate)
  ) {
    return false;
  }

  // 納品予定日未入力
  if (!view.value.deliverDate) {
    return false;
  }

  // 受注
  if (view.value.orderKbn === "1") {
    return view.value.shipDate
      ? view.value.deliverDate < view.value.shipDate
      : view.value.deliverDate < view.value.orderDate;
  }

  // 発注
  return view.value.confirmedDate
    ? view.value.deliverDate < view.value.confirmedDate
    : view.value.deliverDate < view.value.orderDate;
};

const showConfirmedDateError = () => {
  return view.value.confirmedDate && view.value.confirmedDate < view.value.orderDate;
};

const getDeliverDateBaseLabel = () => {
  if (view.value.orderKbn === "1") {
    return view.value.shipDate ? "出荷日" : "受注日";
  }

  if (view.value.orderKbn === "2") {
    return view.value.confirmedDate ? "発注受付完了日" : "発注日";
  }

  return "";
};

//初期処理
onMounted(async () => {
  try {
    if (loginInfo.role === "2") {
      router.push({ name: "top" });
      return;
    }

    loading.value = true;

    const orderInfo = await orderApi.getOrderByOrderNo(route.params.orderNo);

    Object.assign(view.value, orderInfo);

    // 初期表示時の状態を保持
    hasConfirmedDate.value = !!orderInfo.confirmedDate;

    if (view.value.updatedAt) {
      view.value.updatedAt = view.value.updatedAt.substring(0, 10).replace(/-/g, "/");
    }

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
    console.log(e);
    openFailedToast(messages.MSGE001);
  } finally {
    loading.value = false;
  }
});

//処理失敗トースト表示処理
const openFailedToast = (message) => {
  failedToastText.value = message;
  showFailedToastMs.value = TOAST_MS;
};

/**
 * 半角英数字変換処理
 *
 * @param value 検査値
 */
const formatHalfWidthAlphaNumeric = (value) => {
  return value.replace(/[^A-Za-z0-9]/g, "");
};

/**
 * 半角数字変換処理
 *
 * @param value 検査値
 */
const formatHalfWidthNumeric = (value) => {
  const result = value.replace(/[^0-9]/g, "");
  return result === "" ? "" : Number(result);
};

//商品コード参照モーダル表示処理
const openProductModal = () => {
  showProductModal.value = true;
};

//商品参照行選択処理
const onProductSelected = (row) => {
  selectedProduct.value = row;
};

//商品選択行情報反映処理
const applySelectedProduct = () => {
  if (!selectedProduct.value) {
    showProductModal.value = false;
    return;
  }
  view.value.productCode = selectedProduct.value.productCode;
  product.value.productName = selectedProduct.value.productName;
  product.value.productPrice = selectedProduct.value.productPrice;
  showProductModal.value = false;
};

//商品情報モーダル入力反映処理
const applyProductInput = (productCode) => {
  const result = productItems.value.find((item) => item.productCode === productCode);
  if (result) {
    product.value.productName = result.productName;
    product.value.productPrice = result.productPrice;
  } else {
    product.value.productName = null;
    product.value.productPrice = null;
  }
};

//受発注情報更新処理
const updateOrder = async () => {
  try {
    loading.value = true;

    const saveData = {
      orderNo: view.value.orderNo,
      deliverDate: view.value.deliverDate,
      productCode: view.value.productCode,
      quantity: view.value.quantity,
      updatedId: loginInfo.userId,
    };

    if (view.value.orderKbn === "1") {
      saveData.shipDate = view.value.shipDate;
    }

    if (!hasConfirmedDate.value) {
      saveData.confirmedDate = view.value.confirmedDate;
    }

    await orderApi.updateOrder(saveData);

    router.push({
      name: "orderList",
      state: {
        result: true,
        message: messages.MSGI003,
      },
    });
  } catch (e) {
    console.log(e);
    console.log(e.response);
    console.log(e.response?.data);
    openFailedToast(messages.MSGE004);
  } finally {
    loading.value = false;
  }
};
</script>
