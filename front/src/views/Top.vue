<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0"><i class="fas fa-store-alt"></i> トップページ</h3>
    </div>
  </BContainer>

  <!-- トースト -->
  <BToast class="w-100" v-model="showFailedToastMs" variant="danger" no-close-button no-progress>{{
    failedToastText
  }}</BToast>

  <!-- 権限が"2"(管理者)-->
  <div v-if="loginInfo.role == 2">
    <div class="row g-3">
      <div class="col-4">
        <BCard class="shadow-sm mb-3 user-card">
          <template #header>
            <div class="d-flex justify-content-between">
              <strong> <i class="fas fa-user"></i><span class="ms-2">ユーザーマスタ</span></strong>
            </div>
          </template>

          <div>
            <span class="label-text mt-3 mb-4 ms-4">一般</span>
            ：{{ countUser }}件
          </div>
          <div>
            <span class="label-text mb-3 ms-4">管理者</span>
            ：{{ countAdmin }}件
          </div>
        </BCard>
      </div>

      <div class="col-4">
        <BCard class="shadow-sm mb-3 client-card">
          <template #header>
            <div class="d-flex justify-content-between">
              <strong> <i class="fas fa-money-bill-wave"></i><span class="ms-2">取引先マスタ</span></strong>
            </div>
          </template>

          <div>
            <span class="label-text mt-3 mb-4 ms-4">顧客</span>
            ：{{ countCustomer }} 件
          </div>
          <div>
            <span class="label-text mb-3 ms-4">仕入先</span>
            ：{{ countSupplier }}件
          </div>
        </BCard>
      </div>

      <div class="col-4">
        <BCard class="shadow-sm mb-3 product-card">
          <template #header>
            <div class="d-flex justify-content-between">
              <strong> <i class="fas fa-solid fa-barcode"></i><span class="ms-2">商品マスタ</span></strong>
            </div>
          </template>

          <div>
            <span class="label-text mt-3 mb-4 ms-4">受注商品</span>
            ：{{ countJuchuProduct }}件
          </div>
          <div>
            <span class="label-text mb-3 ms-4">発注商品</span>
            ：{{ countHatchuProduct }}件
          </div>
        </BCard>
      </div>
    </div>

    <div class="d-flex justify-content-end">
      <BCard class="shadow-sm mb-3" style="width: 260px">
        <div class="d-flex justify-content-center">
          <span @click="changeSortState" style="cursor: pointer">
            <i class="far fa-clock"></i>
            最終更新日
            <span v-if="sortState === 1" style="color: #000000"> ↑ </span>
            <span v-else-if="sortState === 2" style="color: #000000"> ↓ </span>
            <span v-else style="color: #adb5bd"> ↑ </span>
          </span>
        </div>

        <div>
          <div v-for="label in sortedLabels" :key="label.id" class="d-flex justify-content-center">
            {{ label.name + "：" + label.date }}
          </div>
        </div>
      </BCard>
    </div>
  </div>

  <!-- 権限が"1"(一般)-->
  <div v-if="loginInfo.role == 1">
    <BCard class="shadow-sm mb-3 order-card">
      <template #header>
        <strong> <i class="fas fa-file-invoice-dollar"></i><span class="ms-2">受発注状況</span></strong>
      </template>
      <BCard class="mb-3">
        <div class="ms-4 mb-3">未処理の受発注件数</div>
        <div>
          <span class="label-text mt-3 mb-4 ms-4">受注</span>
          ：
          <RouterLink v-if="countPendingJuchu > 0" :to="{ name: 'orderList' }"> {{ countPendingJuchu }}件 </RouterLink>
          <span v-else> {{ countPendingJuchu }}件 </span>
        </div>
        <div>
          <span class="label-text mb-3 ms-4">発注</span>
          ：
          <RouterLink v-if="countPendingHatchu > 0" :to="{ name: 'orderList' }">
            {{ countPendingHatchu }}件
          </RouterLink>
          <span v-else> {{ countPendingHatchu }}件 </span>
        </div>
      </BCard>
      <BCard class="mb-3">
        <div class="ms-4 mb-3">今月の受注額・発注額の合計</div>
        <div>
          <span class="label-text mt-3 mb-4 ms-4">受注総額</span>
          ：¥{{ totalJuchuAmount.toLocaleString("ja-JP") }}
        </div>
        <div>
          <span class="label-text mb-3 ms-4">発注総額</span>
          ：¥{{ totalHatchuAmount.toLocaleString("ja-JP") }}
        </div>
      </BCard>
    </BCard>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import * as userApi from "@/api/userApi.js";
import * as clientApi from "@/api/clientApi.js";
import * as productApi from "@/api/productApi.js";
import * as orderApi from "@/api/orderApi.js";
import messages from "@/constants/messages.js";
import Loading from "@/components/Loading.vue";
import { getLoginInfo } from "@/utils/auth.js";
import { formatMessage } from "@/utils/messageUtil.js";

// ユーザーマスタ
const users = ref([]);
const countUser = computed(() => users.value.filter((user) => user.role === "1").length);
const countAdmin = computed(() => users.value.filter((user) => user.role === "2").length);
const userUpdatedAt = computed(() => {
  if (users.value.length === 0) {
    return "";
  }
  return users.value
    .reduce((max, user) => (max > user.updatedAt ? max : user.updatedAt), users.value[0].updatedAt)
    .substring(0, 10)
    .replace(/-/g, "/");
});
``;

// 取引先マスタ
const clients = ref([]);
const countCustomer = computed(() => clients.value.filter((client) => client.orderKbn === "1").length);
const countSupplier = computed(() => clients.value.filter((client) => client.orderKbn === "2").length);
const clientUpdatedAt = computed(() => {
  if (clients.value.length === 0) {
    return "";
  }
  return clients.value
    .reduce((max, client) => (max > client.updatedAt ? max : client.updatedAt), clients.value[0].updatedAt)
    .substring(0, 10)
    .replace(/-/g, "/");
});
``;

// 商品マスタ
const products = ref([]);
const countJuchuProduct = computed(() => products.value.filter((product) => product.orderKbn === "1").length);
const countHatchuProduct = computed(() => products.value.filter((product) => product.orderKbn === "2").length);
const productUpdatedAt = computed(() => {
  if (products.value.length === 0) {
    return "";
  }
  return products.value
    .reduce((max, product) => (max > product.updatedAt ? max : product.updatedAt), products.value[0].updatedAt)
    .substring(0, 10)
    .replace(/-/g, "/");
});
``;

// 最終更新日の配列
const lastUpdatedMasters = ref([
  { id: 1, name: "ユーザーマスタ", date: userUpdatedAt },
  { id: 2, name: "取引先マスタ", date: clientUpdatedAt },
  { id: 3, name: "商品マスタ　", date: productUpdatedAt },
]);

// 受発注状況
const orders = ref([]);
const countPendingJuchu = computed(
  () => orders.value.filter((order) => order.orderKbn === "1" && order.confirmedDate == null).length,
);
const countPendingHatchu = computed(
  () => orders.value.filter((order) => order.orderKbn === "2" && order.confirmedDate == null).length,
);
const totalJuchuAmount = computed(() =>
  orders.value
    .filter(
      (order) =>
        order.orderKbn === "1" && order.confirmedDate?.substring(0, 7) === new Date().toISOString().substring(0, 7),
    )
    .reduce((sum, order) => sum + order.amountTaxIncluded, 0),
);
const totalHatchuAmount = computed(() =>
  orders.value
    .filter(
      (order) =>
        order.orderKbn === "2" && order.confirmedDate?.substring(0, 7) === new Date().toISOString().substring(0, 7),
    )
    .reduce((sum, order) => sum + order.amountTaxIncluded, 0),
);
// 読み込み中の表示制御
const loading = ref(false);

// トースト表示ミリ秒
const TOAST_MS = 3000;

// 処理成功・失敗トーストの表示制御
const failedToastText = ref("");
const showFailedToastMs = ref(0);

// ログイン情報
const loginInfo = getLoginInfo();

// ソートの保持状況
const sortState = ref(0);

/**
 * 初期表示処理
 */
onMounted(async () => {
  loading.value = true;
  try {
    // 権限が管理者の場合
    if (loginInfo.role === "2") {
      users.value = await userApi.getUsers();
      clients.value = await clientApi.getClients();
      products.value = await productApi.getProducts();
      // 権限が一般の場合
    } else if (loginInfo.role === "1") {
      orders.value = await orderApi.getOrders();
    }
  } catch (e) {
    console.log(e);
    openFailedToast(messages.MSGE001);
  } finally {
    loading.value = false;
  }
});

/**
 * ソート状態の切り替え
 */
const changeSortState = () => {
  sortState.value = (sortState.value + 1) % 3;
};

/**
 * ソート後の最終更新されたマスタ情報
 */
const sortedLabels = computed(() => {
  const copiedLabels = [...lastUpdatedMasters.value];

  if (sortState.value === 1) {
    // 昇順
    return copiedLabels.sort((a, b) => a.date.localeCompare(b.date));
  } else if (sortState.value === 2) {
    // 降順
    return copiedLabels.sort((a, b) => b.date.localeCompare(a.date));
  } else if (sortState.value === 0) {
    // 未ソート
    return copiedLabels;
  }
});

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

<!-- マスタ画面レイアウト -->
<style>
.user-card .card-header {
  background-color: #e3f2fd;
}

.client-card .card-header {
  background-color: #d4edda;
}

.product-card .card-header {
  background-color: #ffffcc;
}

.order-card .card-header {
  background-color: #ffd7dc;
}

.label-text {
  display: inline-block;
  width: 70px;
}
</style>
