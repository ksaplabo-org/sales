<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">
        {{ view.orderKbn === "1" ? "受注情報" : "発注情報" }}
      </h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/' },
          { text: '受発注情報一覧', to: '/' },
          {
            text: view.orderKbn === '1' ? '受注情報編集' : '発注情報編集',
            active: true,
          },
        ]"
      />
    </div>
  </BContainer>

  <!-- 処理失敗トースト -->
  <BToast class="w-100" v-model="showFailedToastMiliSec" variant="danger" no-progress>{{ failedToastText }}</BToast>

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

          <!-- 確定日未登録 -->
          <BFormInput
            v-else
            id="confirmedDate"
            v-model="view.confirmedDate"
            :state="!view.confirmedDate ? true : view.confirmedDate >= view.orderDate"
            type="date"
          />
          <div v-if="view.confirmedDate && view.confirmedDate < view.orderDate" class="text-danger">
            {{
              formatMessage(
                messages.MSGE017,
                view.orderKbn === "1" ? "入金日" : "発注受付完了日",
                view.orderKbn === "1" ? "受注日" : "発注日",
              )
            }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 出荷日 -->
      <BRow class="mb-3" v-if="view.orderKbn === '1'">
        <BFormGroup label="出荷日" label-cols="3">
          <BFormInput
            id="shipDate"
            v-model="view.shipDate"
            :state="
              !view.shipDate
                ? true
                : view.confirmedDate
                  ? view.shipDate >= view.confirmedDate
                  : view.shipDate >= view.orderDate
            "
            type="date"
          />
          <div
            v-if="
              !(view.confirmedDate && view.confirmedDate < view.orderDate) &&
              view.shipDate &&
              (view.confirmedDate ? view.shipDate < view.confirmedDate : view.shipDate < view.orderDate)
            "
            class="text-danger"
          >
            {{ formatMessage(messages.MSGE017, "出荷日", view.confirmedDate ? "入金日" : "受注日") }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 納品予定日 -->
      <BRow class="mb-3">
        <BFormGroup label="納品予定日" label-cols="3">
          <BFormInput
            id="deliverDate"
            v-model="view.deliverDate"
            :state="
              !view.deliverDate
                ? true
                : view.orderKbn === '1'
                  ? view.shipDate
                    ? view.deliverDate >= view.shipDate
                    : view.deliverDate >= view.orderDate
                  : view.confirmedDate
                    ? view.deliverDate >= view.confirmedDate
                    : view.deliverDate >= view.orderDate
            "
            type="date"
          />
          <div
            v-if="
              !(view.confirmedDate && view.confirmedDate < view.orderDate) &&
              !(
                view.shipDate &&
                (view.confirmedDate ? view.shipDate < view.confirmedDate : view.shipDate < view.orderDate)
              ) &&
              view.deliverDate &&
              (view.orderKbn === '1'
                ? view.shipDate
                  ? view.deliverDate < view.shipDate
                  : view.deliverDate < view.orderDate
                : view.confirmedDate
                  ? view.deliverDate < view.confirmedDate
                  : view.deliverDate < view.orderDate)
            "
            class="text-danger"
          >
            {{
              formatMessage(
                messages.MSGE017,
                "納品予定日",
                view.orderKbn === "1"
                  ? view.shipDate
                    ? "出荷日"
                    : "受注日"
                  : view.confirmedDate
                    ? "発注受付完了日"
                    : "発注日",
              )
            }}
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
                @input="applyProductInput"
                :state="!!view.productCode && view.productCode.length === 7 && product.productName !== '-'"
                :formatter="formatHalfWidthAlphaNumeric"
                maxlength="7"
              />

              <div v-if="view.productCode.length === 7 && product.productName === '-'" class="text-danger">
                {{ formatMessage(messages.MSGE019, "商品コード") }}
              </div>
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
  <BModal
    v-model="showProductModal"
    title="商品コードの参照"
    size="lg"
    ok-title="確定"
    cancel-title="キャンセル"
    @ok="applySelectedProduct"
  >
    <BTable
      :items="productItems"
      :fields="productFields"
      striped
      hover
      @row-clicked="applySelectedProduct"
      :tbody-tr-class="(item) => (item && selectedProduct?.productCode === item.productCode ? 'table-primary' : '')"
    >
    </BTable>
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
    console.log(e);
    openFailedToast(messages.MSGE001);
  } finally {
    loading.value = false;
  }
});

//処理失敗トースト表示処理
const openFailedToast = (message) => {
  failedToastText.value = message;
  showFailedToastMiliSec.value = TOAST_MS;
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

//商品選択行情報反映処理
const applySelectedProduct = (row) => {
  if (row?.item) {
    selectedProduct.value = row.item;
    return;
  }
  if (!selectedProduct.value) {
    return;
  }
  view.value.productCode = selectedProduct.value.productCode;
  product.value.productName = selectedProduct.value.productName;
  product.value.productPrice = selectedProduct.value.productPrice;
  showProductModal.value = false;
};

//商品情報モーダル入力反映処理
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

//受発注情報更新処理
const updateOrder = async () => {
  if (
    (view.value.confirmedDate && view.value.confirmedDate < view.value.orderDate) ||
    (view.value.orderKbn === "1" &&
      view.value.shipDate &&
      (view.value.confirmedDate
        ? view.value.shipDate < view.value.confirmedDate
        : view.value.shipDate < view.value.orderDate)) ||
    (view.value.deliverDate &&
      (view.value.orderKbn === "1"
        ? view.value.shipDate
          ? view.value.deliverDate < view.value.shipDate
          : view.value.deliverDate < view.value.orderDate
        : view.value.confirmedDate
          ? view.value.deliverDate < view.value.confirmedDate
          : view.value.deliverDate < view.value.orderDate)) ||
    !view.value.productCode ||
    view.value.productCode.length !== 7 ||
    product.value.productName === "-" ||
    view.value.quantity === "" ||
    view.value.quantity === null ||
    Number(view.value.quantity) < 1
  ) {
    openFailedToast(massages.MSGE004);
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
      name: "orderList",
      state: {
        result: true,
        message: "更新に成功しました。",
      },
    });
  } catch (e) {
    console.log(e);
    openFailedToast(messages.MSGE004);
  } finally {
    loading.value = false;
  }
};

//ルート情報取得
const route = useRoute();
const router = useRouter();

// ログイン情報
const loginInfo = Auth.getLoginInfo();

//処理失敗トースト表示
const failedToastText = ref("");
const showFailedToastMiliSec = ref(0);
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
  productName: "-",
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

//商品情報一覧列定義
const productFields = computed(() => {
  const fields = [
    { key: "productCode", label: "商品コード", sortable: true },
    { key: "productName", label: "商品名" },
  ];
  if (view.value.orderKbn === "2") {
    fields.push({ key: "orderClientCode", label: "発注先コード" });
  }
  fields.push({ key: "productPrice", label: "単価" });
  return fields;
});
</script>

<!-- 参照ボタンレイアウト -->
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
