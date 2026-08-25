<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">
        {{ isReceive ? "受注情報登録" : "発注情報登録" }}
      </h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/' },
          { text: '受発注情報一覧', to: { name: 'orderList' } },
          { text: isReceive ? '受注情報登録' : '発注情報登録', active: true },
        ]"
      />
    </div>
  </BContainer>

  <!-- トースト -->
  <BToast class="w-100" v-model="showSuccessToastMiliSec" variant="success" no-progress>{{ successToastText }}</BToast>
  <BToast class="w-100" v-model="showFailedToastMiliSec" variant="danger" no-progress>{{ failedToastText }}</BToast>

  <!-- ヘッダー -->
  <BCard class="shadow-sm mb-3">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <strong>登録情報</strong>
      </div>
    </template>

    <!-- 受発注番号 -->
    <BForm @submit.prevent="createOrder">
      <BRow class="mb-3">
        <BFormGroup :label="isReceive ? '受注番号' : '発注番号'" label-cols="3">
          <BFormInput
            id="orderNo"
            v-model="form.orderNo"
            :state="form.orderNo.length === 8"
            :formatter="formatHalfWidthAlphaNumeric"
            maxlength="8"
            required
          />
          <BFormInvalidFeedback v-if="form.orderNo">
            {{ formatMessage(messages.MSGE008, "受発注番号", 8) }}
          </BFormInvalidFeedback>
        </BFormGroup>
      </BRow>

      <!-- 取引先コード -->
      <BRow class="mb-3">
        <BFormGroup label="取引先コード" label-cols="3">
          <div class="d-flex gap-2">
            <BFormInput
              id="clientCode"
              v-model="form.clientCode"
              :state="clientCodeState"
              :formatter="formatHalfWidthAlphaNumeric"
              maxlength="8"
              @input="client.clientName = ''"
              @blur="applyClientInput(form.clientCode)"
              required
            />
            <BButton type="button" variant="outline-primary" class="btn-reference text-nowrap" @click="openClientModal">
              <i class="fas fa-list me-1"></i>参照
            </BButton>
          </div>
          <div v-if="form.clientCode.length && client.clientName === null" class="text-danger">
            {{ formatMessage(messages.MSGE019, "取引先コード") }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 取引先参照モーダル -->
      <BModal v-model="showClientModal" title="取引先コードの参照" size="lg">
        <BTable
          :items="clientItems"
          :fields="clientFields"
          hover
          selectable
          select-mode="single"
          @row-selected="onClientSelected"
        >
          <template #cell(postCode)="data">
            {{ formatPostCode(data.value) }}
          </template>
        </BTable>
        <div v-if="clientItems.length === 0" class="text-center text-muted mt-3">検索結果がありません</div>
        <template #footer>
          <BButton variant="secondary" @click="showClientModal = false">キャンセル</BButton>
          <BButton variant="primary" @click="applySelectedClient">確定</BButton>
        </template>
      </BModal>

      <!-- 取引先名 -->
      <BRow class="mb-3">
        <BFormGroup label="取引先名" label-cols="3">
          <div class="form-control-plaintext">
            {{ client.clientName || "-" }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 電話番号 -->
      <BRow class="mb-3">
        <BFormGroup label="電話番号" label-cols="3">
          <div class="form-control-plaintext">
            {{ client.telNumber || "-" }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 住所１ -->
      <BRow class="mb-3">
        <BFormGroup label="住所1" label-cols="3">
          <div class="form-control-plaintext">
            {{ client.address1 || "-" }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 受発注日 -->
      <BRow class="mb-3">
        <BFormGroup :label="isReceive ? '受注日' : '発注日'" label-cols="3">
          <BFormInput id="orderDate" v-model="form.orderDate" :state="!!form.orderDate" type="date" required />
        </BFormGroup>
      </BRow>

      <!-- 確定日 -->
      <BRow class="mb-3">
        <BFormGroup :label="isReceive ? '入金日' : '発注受付完了日'" label-cols="3">
          <BFormInput
            id="confirmedDate"
            v-model="form.confirmedDate"
            :state="form.confirmedDate === '' ? null : form.confirmedDate >= form.orderDate"
            type="date"
          />
          <div v-if="form.confirmedDate && form.confirmedDate < form.orderDate" class="text-danger">
            {{
              formatMessage(messages.MSGE017, isReceive ? "入金日" : "発注受付完了日", isReceive ? "受注日" : "発注日")
            }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 出荷日 -->
      <BRow class="mb-3" v-if="isReceive">
        <BFormGroup label="出荷日" label-cols="3">
          <BFormInput
            id="shipDate"
            v-model="form.shipDate"
            :state="
              !!form.shipDate &&
              (form.confirmedDate ? form.shipDate >= form.confirmedDate : form.shipDate >= form.orderDate)
            "
            type="date"
            required
          />
          <div
            v-if="
              !(form.confirmedDate && form.confirmedDate < form.orderDate) &&
              form.shipDate &&
              (form.confirmedDate ? form.shipDate < form.confirmedDate : form.shipDate < form.orderDate)
            "
            class="text-danger"
          >
            {{ formatMessage(messages.MSGE017, "出荷日", form.confirmedDate ? "入金日" : "受注日") }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 納品予定日 -->
      <BRow class="mb-3">
        <BFormGroup label="納品予定日" label-cols="3">
          <BFormInput
            id="deliverDate"
            v-model="form.deliverDate"
            :state="
              !form.deliverDate
                ? null
                : isReceive
                  ? form.shipDate
                    ? form.deliverDate >= form.shipDate
                    : form.deliverDate >= form.orderDate
                  : form.confirmedDate
                    ? form.deliverDate >= form.confirmedDate
                    : form.deliverDate >= form.orderDate
            "
            type="date"
          />
          <div
            v-if="
              !(form.confirmedDate && form.confirmedDate < form.orderDate) &&
              !(
                form.shipDate &&
                (form.confirmedDate ? form.shipDate < form.confirmedDate : form.shipDate < form.orderDate)
              ) &&
              form.deliverDate &&
              (isReceive
                ? form.shipDate
                  ? form.deliverDate < form.shipDate
                  : form.deliverDate < form.orderDate
                : form.confirmedDate
                  ? form.deliverDate < form.confirmedDate
                  : form.deliverDate < form.orderDate)
            "
            class="text-danger"
          >
            {{
              formatMessage(
                messages.MSGE017,
                "納品予定日",
                isReceive ? (form.shipDate ? "出荷日" : "受注日") : form.confirmedDate ? "発注受付完了日" : "発注日",
              )
            }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 商品コード -->
      <BRow class="mb-3">
        <BFormGroup label="商品コード" label-cols="3">
          <div class="d-flex gap-2">
            <BFormInput
              id="productCode"
              v-model="form.productCode"
              :state="productCodeState"
              :formatter="formatHalfWidthAlphaNumeric"
              maxlength="7"
              @input="product.productName = ''"
              @blur="applyProductInput(form.productCode)"
              required
            />
            <BButton
              type="button"
              variant="outline-primary"
              class="btn-reference text-nowrap"
              @click="openProductModal"
            >
              <i class="fas fa-list me-1"></i>参照
            </BButton>
          </div>
          <div v-if="form.productCode.length && product.productName === null" class="text-danger">
            {{ formatMessage(messages.MSGE019, "商品コード") }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 商品参照モーダル -->
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
          <BButton variant="secondary" @click="showProductModal = false">キャンセル</BButton>
          <BButton variant="primary" @click="applySelectedProduct">確定</BButton>
        </template>
      </BModal>

      <!-- 商品名 -->
      <BRow class="mb-3">
        <BFormGroup label="商品名" label-cols="3">
          <div class="form-control-plaintext">
            {{ product.productName || "-" }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 単価 -->
      <BRow class="mb-3">
        <BFormGroup label="単価" label-cols="3">
          <div class="form-control-plaintext">
            {{ product.productPrice || "-" }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 数量 -->
      <BRow class="mb-3">
        <BFormGroup label="数量" label-cols="3">
          <BFormInput
            id="quantity"
            v-model="form.quantity"
            :state="Number(form.quantity) >= 1"
            :formatter="formatHalfWidthNumeric"
            type="number"
            min="1"
            @blur="calculateAmount"
            required
          />
          <div v-if="form.quantity !== '' && form.quantity !== null && Number(form.quantity) < 1" class="text-danger">
            {{ formatMessage(messages.MSGE016, "数量", 1) }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 金額 -->
      <BRow class="mb-3">
        <BFormGroup label="金額" label-cols="3">
          <div class="form-control-plaintext">
            {{ calculate.amount ? calculate.amount.toLocaleString() : "-" }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 消費税 -->
      <BRow class="mb-3">
        <BFormGroup label="消費税" label-cols="3">
          <div class="form-control-plaintext">
            {{ calculate.tax ? calculate.tax.toLocaleString() : "-" }}
          </div>
        </BFormGroup>
      </BRow>

      <!-- 合計金額 -->
      <BRow class="mb-3">
        <BFormGroup :label="isReceive ? '請求金額' : '支払金額'" label-cols="3">
          <div class="form-control-plaintext">
            {{ calculate.amountTaxIncluded ? calculate.amountTaxIncluded.toLocaleString() : "-" }}
          </div>
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
import * as productApi from "@/api/productApi.js";
import * as orderApi from "@/api/orderApi.js";

import Loading from "@/components/Loading.vue";
import * as Auth from "@/utils/auth.js";
import messages from "@/constants/messages.js";
import { formatMessage } from "@/utils/messageUtil.js";

const route = useRoute();
const router = useRouter();

const loading = ref(false);

// ログイン情報
const loginInfo = Auth.getLoginInfo();

//登録の受発注判定
const isReceive = computed(() => {
  return route.name === "orderReceiveCreate";
});

//受発注区分
const orderKbn = ref("");

// 入力情報
const form = ref({
  orderNo: "",
  clientCode: "",
  orderDate: "",
  confirmedDate: "",
  shipDate: "",
  deliverDate: "",
  productCode: "",
  quantity: null,
});

//取引先情報
const client = ref({
  clientName: "",
  telNumber: "",
  address1: "",
});

//商品情報
const product = ref({
  productName: "",
  productPrice: null,
});

//数量詳細
const calculate = ref({
  amount: null,
  tax: null,
  amountTaxIncluded: null,
});

//一覧検索結果
const clientItems = ref([]);
const productItems = ref([]);

//参照行選択
const selectedClient = ref(null);
const selectedProduct = ref(null);

//モーダル表示制御
const showClientModal = ref(false);
const showProductModal = ref(false);

//処理トースト表示
const successToastText = ref("");
const failedToastText = ref("");

//処理トースト表示ミリ秒
const showSuccessToastMiliSec = ref(0);
const showFailedToastMiliSec = ref(0);

//トースト表示ミリ秒
const TOAST_MS = 1500;

//一覧列定義
//取引先
const clientFields = [
  { key: "clientCode", label: "取引先コード", thStyle: { whiteSpace: "nowrap" }, sortable: true },
  { key: "clientName", label: "取引先名", thStyle: { whiteSpace: "nowrap" } },
  { key: "postCode", label: "郵便番号", thStyle: { whiteSpace: "nowrap" } },
  { key: "address1", label: "住所1", thStyle: { whiteSpace: "nowrap" } },
  { key: "address2", label: "住所2", thStyle: { whiteSpace: "nowrap" } },
  { key: "telNumber", label: "電話番号", thStyle: { whiteSpace: "nowrap" } },
];
//商品(受注時)
const productFields = computed(() => {
  if (isReceive.value) {
    return [
      { key: "productCode", label: "商品コード", thStyle: { whiteSpace: "nowrap" }, sortable: true },
      { key: "productName", label: "商品名", thStyle: { whiteSpace: "nowrap" } },
      { key: "productPrice", label: "単価", thStyle: { whiteSpace: "nowrap" } },
    ];
  }
  //商品(発注時)
  return [
    { key: "productCode", label: "商品コード", thStyle: { whiteSpace: "nowrap" }, sortable: true },
    { key: "productName", label: "商品名", thStyle: { whiteSpace: "nowrap" } },
    { key: "orderClientCode", label: "発注先コード", thStyle: { whiteSpace: "nowrap" } },
    { key: "productPrice", label: "単価", thStyle: { whiteSpace: "nowrap" } },
  ];
});

const clientCodeState = computed(() => !!client.value.clientName);
const productCodeState = computed(() => !!product.value.productName);

//半角英数字
const formatHalfWidthAlphaNumeric = (value) => {
  return value.replace(/[^A-Za-z0-9]/g, "");
};

//半角数字
const formatHalfWidthNumeric = (value) => {
  const result = value.replace(/[^0-9]/g, "");
  return result === "" ? "" : Number(result);
};

//郵便番号
const formatPostCode = (postCode) => {
  return postCode.replace(/^(\d{3})(\d{4})$/, "$1-$2");
};

/**
 * No1初期表示処理
 */
onMounted(async () => {
  try {
    //権限チェック
    if (loginInfo.role === "2") {
      router.push({ name: "top" });
      return;
    }

    //受発注判定
    if (isReceive.value) {
      orderKbn.value = "1";
    } else {
      orderKbn.value = "2";
    }

    loading.value = true;

    //取引先情報一覧取得
    clientItems.value = await clientApi.getClients({ orderKbn: orderKbn.value });

    //商品情報一覧取得
    productItems.value = await productApi.getProducts({ orderKbn: orderKbn.value });
  } catch (e) {
    console.log(e);

    openFailedToast(messages.MSGE001);
  } finally {
    loading.value = false;
  }
});

/**
 * No2取引先情報モーダル表示処理
 */
const openClientModal = () => {
  showClientModal.value = true;
};

/**
 * No3取引先参照行選択処理
 */
const onClientSelected = (row) => {
  selectedClient.value = row;
};

/**
 * No4取引先選択行情報反映処理
 */
const applySelectedClient = () => {
  if (!selectedClient.value) {
    showClientModal.value = false;
    return;
  }
  form.value.clientCode = selectedClient.value.clientCode;
  client.value.clientName = selectedClient.value.clientName;
  client.value.telNumber = selectedClient.value.telNumber;
  client.value.address1 = selectedClient.value.address1;

  showClientModal.value = false;
};

/**
 * No5取引先情報入力反映処理
 */
const applyClientInput = (clientCode) => {
  const result = clientItems.value.find((item) => item.clientCode === clientCode);

  if (result) {
    client.value.clientName = result.clientName;
    client.value.telNumber = result.telNumber;
    client.value.address1 = result.address1;
  } else {
    client.value.clientName = null;
    client.value.telNumber = null;
    client.value.address1 = null;
  }
};

/**
 * No6商品情報モーダル表示処理
 */
const openProductModal = () => {
  showProductModal.value = true;
};

/**
 * No7商品参照行選択処理
 */
const onProductSelected = (row) => {
  selectedProduct.value = row;
};

/**
 * No8商品選択行情報反映処理
 */
const applySelectedProduct = () => {
  if (!selectedProduct.value) {
    showProductModal.value = false;
    return;
  }
  form.value.productCode = selectedProduct.value.productCode;
  product.value.productName = selectedProduct.value.productName;
  product.value.productPrice = selectedProduct.value.productPrice;

  calculateAmount();

  showProductModal.value = false;
};

/**
 * No9商品情報モーダル入力反映処理
 */
const applyProductInput = (productCode) => {
  const result = productItems.value.find((item) => item.productCode === productCode);

  if (result) {
    product.value.productName = result.productName;
    product.value.productPrice = result.productPrice;
  } else {
    product.value.productName = null;
    product.value.productPrice = null;
  }

  calculateAmount();
};

/**
 * No10金額計算処理
 */
const calculateAmount = () => {
  if (!product.value.productPrice || Number(form.value.quantity) < 1) {
    calculate.value.amount = null;
    calculate.value.tax = null;
    calculate.value.amountTaxIncluded = null;

    return;
  }

  calculate.value.amount = Number(product.value.productPrice) * Number(form.value.quantity);
  calculate.value.tax = Math.round(calculate.value.amount * 0.1);
  calculate.value.amountTaxIncluded = calculate.value.amount + calculate.value.tax;
};

/**
 * No14処理成功トースト表示処理
 */
const openSuccessToast = (message) => {
  successToastText.value = message;
  showSuccessToastMiliSec.value = TOAST_MS;
};

/**
 * No15処理失敗トースト表示処理
 */
const openFailedToast = (message) => {
  failedToastText.value = message;
  showFailedToastMiliSec.value = TOAST_MS;
};

/**
 * No16受発注情報登録処理
 */
const createOrder = async () => {
  try {
    loading.value = true;

    const saveData = {
      ...form.value,

      createdId: loginInfo.userId,
      orderKbn: orderKbn.value,
    };

    await orderApi.createOrder(saveData);

    router.push({
      name: "orderList",
      state: {
        message: messages.MSGI003,
        result: true,
      },
    });
  } catch (e) {
    console.log(e);

    openFailedToast(messages.MSGE004);
  } finally {
    loading.value = false;
  }
};
</script>

<style>
/*参照ボタンレイアウト*/
.btn-reference {
  background-color: #fff !important;
  border-color: #0d6efb !important;
  color: #000 !important;
}

.btn-reference:hover {
  background-color: #0b5ed7 !important;
  border-color: #0a58ca !important;
  color: #fff !important;
}

.btn-reference:focus,
.btn-reference:focus-visible {
  box-shadow: 0 0 0 0.25rem rgba(2, 100, 150, 0.25) !important;
}
</style>
