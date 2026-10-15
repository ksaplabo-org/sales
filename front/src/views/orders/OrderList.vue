<template>
  <!-- タイトル -->
  <BContainer fluid class="px-0 pb-2 mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mb-0">受発注情報一覧</h3>
      <BBreadcrumb
        :items="[
          { text: 'トップページ', to: '/' },
          { text: '受発注情報一覧', active: true },
        ]"
      />
    </div>
  </BContainer>

  <!-- トースト -->
  <BToast class="w-100" v-model="showSuccessToastMs" variant="success" no-progress>{{ successToastText }}</BToast>
  <BToast class="w-100" v-model="showFailedToastMs" variant="danger" no-progress>{{ failedToastText }}</BToast>

  <!-- 検索条件 -->
  <BCard class="shadow-sm mb-3">
    <template #header>
      <strong>検索条件</strong>
    </template>

    <BForm @submit.prevent="searchOrders">
      <BRow>
        <BCol md="4">
          <BFormGroup label="受発注番号">
            <BFormInput
              placeholder="受発注番号を入力"
              v-model="condition.orderNo"
              maxlength="8"
              type="text"
              @input="formatAlphaNumericInput"
              @compositionend="formatAlphaNumericInput"
            />
          </BFormGroup>
        </BCol>

        <BCol md="4">
          <BFormGroup label="受発注区分">
            <BFormSelect
              v-model="condition.orderKbn"
              :options="[
                { value: '', text: '全て表示' },
                { value: '1', text: '受注のみ表示' },
                { value: '2', text: '発注のみ表示' },
              ]"
            />
          </BFormGroup>
        </BCol>

        <BCol md="4">
          <BFormGroup label="取引先コード">
            <BFormInput
              placeholder="取引先コードを入力"
              v-model="condition.clientCode"
              maxlength="8"
              type="text"
              @input="formatAlphaNumericInput"
              @compositionend="formatAlphaNumericInput"
            />
          </BFormGroup>
        </BCol>

        <BCol md="4">
          <BFormGroup label="商品コード">
            <BFormInput
              placeholder="商品コードを入力"
              v-model="condition.productCode"
              maxlength="7"
              type="text"
              @input="formatAlphaNumericInput"
              @compositionend="formatAlphaNumericInput"
            />
          </BFormGroup>
        </BCol>

        <BCol md="4">
          <BFormGroup label="合計金額">
            <div class="d-flex align-items-center">
              <BFormInput
                placeholder="下限"
                v-model="condition.amountTaxIncludedLow"
                type="text"
                @input="formatNumericInput"
                @compositionend="formatNumericInput"
              />
              <span class="mx-2">～</span>
              <BFormInput
                placeholder="上限"
                v-model="condition.amountTaxIncludedHigh"
                type="text"
                @input="formatNumericInput"
                @compositionend="formatNumericInput"
              />
            </div>
          </BFormGroup>
        </BCol>
      </BRow>

      <BRow class="mt-3">
        <BCol class="text-end">
          <BButton variant="outline-secondary" class="me-2" @click="clearCondition">
            <i class="fas fa-redo"></i>
            クリア
          </BButton>
          <BButton type="submit" variant="primary">
            <i class="fas fa-search"></i>
            検索
          </BButton>
        </BCol>
      </BRow>
    </BForm>
  </BCard>

  <!-- 検索結果 -->
  <BCard class="shadow-sm">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <strong>検索結果 ( {{ totalCount }} 件 )</strong>

        <div class="d-flex gap-2" v-if="loginInfo.role == 1">
          <BButton class="btn-receive" size="sm" :to="{ name: 'orderReceiveCreate' }">
            <div class="d-flex align-items-center">
              <div class="d-inline-flex flex-column align-items-center me-1 mb-1">
                <i class="fas fa-arrow-down fa-xs" aria-hidden="true"></i>
                <i class="fas fa-box fa-xs" aria-hidden="true"></i>
              </div>
              受注登録
            </div>
          </BButton>

          <BButton class="btn-sale" size="sm" :to="{ name: 'orderSaleCreate' }">
            <div class="d-flex align-items-center">
              <div class="d-inline-flex flex-column align-items-center me-1 mb-1">
                <i class="fas fa-arrow-up fa-xs" aria-hidden="true"></i>
                <i class="fas fa-box fa-xs" aria-hidden="true"></i>
              </div>
              発注登録
            </div>
          </BButton>
        </div>
      </div>
    </template>

    <BTable head-variant="secondary" :items="items" :fields="fields" class="mb-0" show-empty responsive hover>
      <!-- 受発注区分 -->
      <template #cell(orderKbn)="row">
        {{ orderKbnOptions.find((orderKbn) => orderKbn.value === row.value)?.text }}
      </template>

      <!-- 受発注日 -->
      <template #cell(orderDate)="row">
        {{ row.item.orderDate?.replace(/-/g, "/") }}
      </template>

      <!-- 確定日 -->
      <template #cell(confirmedDate)="row">
        {{ row.item.confirmedDate?.replace(/-/g, "/") ?? "-" }}
      </template>

      <!-- 合計金額 -->
      <template #cell(amountTaxIncluded)="row">
        {{ row.item.amountTaxIncluded?.toLocaleString("ja-JP") }}
      </template>

      <!-- 編集・削除ボタン -->
      <template #cell(actions)="row">
        <BContainer fluid class="d-flex justify-content-center gap-2 px-0">
          <BButton
            size="sm"
            variant="outline-primary"
            @click="router.push({ name: 'orderEdit', params: { orderNo: row.item.orderNo } })"
            v-if="loginInfo.role == 1"
          >
            <i class="fas fa-pen"></i>
            編集
          </BButton>
          <BButton
            size="sm"
            variant="outline-danger"
            @click="openDeleteModal(row.item)"
            v-if="loginInfo.role == 1 && row.item.confirmedDate == null"
          >
            <i class="far fa-trash-alt"></i>
            削除
          </BButton>
          <BButton
            size="sm"
            variant="outline-success"
            @click="exportDeliveryNote(row.item)"
            v-if="row.item.orderKbn === '1' && row.item.confirmedDate && row.item.deliverDate"
          >
            <i class="fas fa-file-excel"></i>
            納品書
          </BButton>
        </BContainer>
      </template>

      <!-- 検索結果なし -->
      <template #empty>
        <div class="text-center py-0">{{ messages.MSGI002 }}</div>
      </template>
    </BTable>
  </BCard>

  <!-- 削除確認モーダル -->
  <BModal
    v-model="showDeleteModal"
    title="削除確認"
    ok-title="削除"
    ok-variant="danger"
    cancel-title="キャンセル"
    @ok="deleteOrder()"
  >
    <p>{{ targetRow?.orderNo }} を削除しますか？</p>
  </BModal>

  <!-- ローディングマスク -->
  <Loading v-if="loading" />
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import * as orderApi from "@/api/orderApi.js";
import * as clientApi from "@/api/clientApi.js";
import * as productApi from "@/api/productApi.js";
import * as userApi from "@/api/userApi.js";
import messages from "@/constants/messages.js";
import Loading from "@/components/Loading.vue";
import { getLoginInfo } from "@/utils/auth.js";
import ExcelJS from "exceljs";

// Router操作
const router = useRouter();

// 受発注区分の一覧
const orderKbnOptions = [
  { value: "1", text: "受注" },
  { value: "2", text: "発注" },
];

// 検索結果
const items = ref([]);
// 検索結果の合計件数
const totalCount = computed(() => items.value.length);
// 一覧のカラム定義
const fields = [
  { key: "orderNo", label: "受発注番号", sortable: true },
  { key: "orderKbn", label: "受発注区分" },
  { key: "clientCode", label: "取引先コード" },
  { key: "productCode", label: "商品コード" },
  { key: "orderDate", label: "受発注日" },
  { key: "confirmedDate", label: "確定日" },
  { key: "amountTaxIncluded", label: "合計金額" },
  { key: "actions", label: "" },
];

// 検索条件
const condition = ref({
  orderNo: "",
  orderKbn: "",
  clientCode: "",
  productCode: "",
  amountTaxIncludedLow: null,
  amountTaxIncludedHigh: null,
});

// 読み込み中の表示制御
const loading = ref(false);
// 削除確認モーダルの表示制御
const showDeleteModal = ref(false);
// 処理中のデータ
const targetRow = ref(null);

// トースト表示ミリ秒
const TOAST_MS = 1500;

// 処理成功・失敗トーストの表示制御
const successToastText = ref("");
const failedToastText = ref("");
const showSuccessToastMs = ref(0);
const showFailedToastMs = ref(0);

// ログイン情報
const loginInfo = getLoginInfo();

/**
 * 初期表示処理
 */
onMounted(async () => {
  // 登録画面からの遷移の場合にメッセージを出力
  const state = history.state;
  if (state.result) {
    // 成功メッセージ表示
    openSuccessToast(state.message);

    // 再表示の防止のためstateを初期化
    history.replaceState({}, "");
  }

  // 一覧検索
  await searchOrders();
});

/**
 * 検索条件の初期化処理
 */
const clearCondition = () => {
  condition.value = {
    orderNo: "",
    orderKbn: "",
    clientCode: "",
    productCode: "",
    amountTaxIncludedLow: null,
    amountTaxIncludedHigh: null,
  };
};

/**
 * 半角英数字変換処理
 *
 * @param event 画面からの情報
 */
const formatAlphaNumericInput = (event) => {
  // IME変換中の値は変換しないように制御
  if (event.isComposing) return;

  const input = event.target;
  const formatValue = input.value.replace(/[^A-Za-z0-9]/g, ""); // フォーマット処理
  if (input.value !== formatValue) {
    // 入力値にフォーマットした値を反映
    input.value = formatValue;
    // 双方向バインディングに反映するためinputイベントを発火
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
};

/**
 * 数値変換処理
 *
 * @param event 画面からの情報
 */
const formatNumericInput = (event) => {
  // IME変換中の値は変換しないように制御
  if (event.isComposing) return;

  const input = event.target;
  const formatValue = input.value.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, ""); // フォーマット処理
  if (input.value !== formatValue) {
    // 入力値にフォーマットした値を反映
    input.value = formatValue;
    // 双方向バインディングに反映するためinputイベントを発火
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
};

/**
 * 受発注情報一覧検索処理
 */
const searchOrders = async () => {
  loading.value = true;
  try {
    items.value = await orderApi.getOrders(condition.value);
  } catch (e) {
    console.log(e);
    openFailedToast(messages.MSGE001);
  } finally {
    loading.value = false;
  }
};

/**
 * 処理成功トースト表示処理
 *
 * @param message メッセージ
 */
const openSuccessToast = (message) => {
  successToastText.value = message;
  showSuccessToastMs.value = TOAST_MS;
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

/**
 * 削除確認モーダル表示処理
 *
 * @param row 一覧行データ
 */
const openDeleteModal = (row) => {
  targetRow.value = row;
  showDeleteModal.value = true;
};

/**
 * 受発注情報削除処理
 */
const deleteOrder = async () => {
  loading.value = true;
  try {
    await orderApi.deleteOrder(targetRow.value.orderNo);
    await searchOrders();
    openSuccessToast(messages.MSGI006);
  } catch (e) {
    console.log(e);
    openFailedToast(messages.MSGE007);
  } finally {
    loading.value = false;
  }
};

/**
 * 日付フォーマット
 *
 * yyyy年MM月dd日
 *
 * @param date 日付
 * @returns フォーマット後の日付
 */
const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const targetDate = new Date(date);

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");

  return `${year}年${month}月${day}日`;
};

/**
 * 金額フォーマット
 *
 * @param value 金額
 * @returns フォーマット後金額
 */
const formatAmount = (value) => {
  if (value == null) {
    return "";
  }
  return `¥${Number(value).toLocaleString("ja-JP")}`;
};

/**
 * 納品書出力
 */
const exportDeliveryNote = async (row) => {
  loading.value = true;
  try {
    // データ取得
    const orderInfo = await orderApi.getOrderByOrderNo(row.orderNo);
    const clientInfo = await clientApi.getClientByClientCode(orderInfo.clientCode);
    const productInfo = await productApi.getProductByProductCode(orderInfo.productCode);
    const userInfo = await userApi.getUserByUserId(loginInfo.userId);

    // Excel作成
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("納品書");

    // レイアウト
    worksheet.getColumn("A").width = 40;
    worksheet.getColumn("B").width = 12;
    worksheet.getColumn("C").width = 17;
    worksheet.getColumn("D").width = 23;
    worksheet.getRow(1).height = 65;
    
    //印刷設定（1ページに収まるように調整）
    worksheet.pageSetup = {
      fitToPage: true,
    };
   
    // セル結合
    ["A1:D1", "A20:D20", "C14:D14", "C15:D15", "C16:D16", "C17:D17"].forEach((range) => {
      worksheet.mergeCells(range);
    });

    // タイトル
    worksheet.getCell("A1").value = "納品書";
    worksheet.getCell("A1").font = {
      bold: true,
      size: 28,
    };
    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // 説明文
    worksheet.getCell("A20").value = "下記の通り納品いたしました。";
    worksheet.getCell("A20").alignment = {
      horizontal: "center",
    };

    // 表ヘッダ
    const headers = [
      { cell: "A23", value: "商品名" },
      { cell: "B23", value: "数量" },
      { cell: "C23", value: "単価" },
      { cell: "D23", value: "金額" },
      { cell: "C27", value: "消費税" },
      { cell: "C28", value: "合計金額" },
    ];
    headers.forEach(({ cell, value }) => {
      const targetCell = worksheet.getCell(cell);
      targetCell.value = value;
      targetCell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };
      targetCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472C4" },
      };
      targetCell.alignment = {
        horizontal: "center",
      };
    });

    // 枠線
    const borderStyle = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    ["A23", "B23", "C23", "D23", "A24", "B24", "C24", "D24", "C27", "D27", "C28", "D28"].forEach((cell) => {
      worksheet.getCell(cell).border = borderStyle;
    });

    // 表示情報
    const dataMapping = [
      { cell: "C4", value: `発行日：${formatDate(new Date())}` },
      { cell: "C5", value: `発行者：${userInfo.lastName} ${userInfo.firstName}` },
      { cell: "C7", value: `受注番号：${orderInfo.orderNo}` },
      { cell: "C8", value: `受注日：${formatDate(orderInfo.orderDate)}` },
      { cell: "C9", value: `入金日：${formatDate(orderInfo.confirmedDate)}` },
      { cell: "C10", value: `出荷日：${formatDate(orderInfo.shipDate)}` },
      { cell: "C11", value: `納品日：${formatDate(orderInfo.deliverDate)}` },
      { cell: "C14", value: clientInfo.clientName },
      { cell: "A24", value: productInfo.productName },
      { cell: "B24", value: orderInfo.quantity },
      { cell: "C24", value: formatAmount(productInfo.productPrice) },
      { cell: "D24", value: formatAmount(orderInfo.amount) },
      { cell: "D27", value: formatAmount(orderInfo.tax) },
      { cell: "D28", value: formatAmount(orderInfo.amountTaxIncluded) },
    ];
    dataMapping.forEach(({ cell, value }) => {
      worksheet.getCell(cell).value = value;
    });

    //住所・電話番号
    const address1 = clientInfo.address1 ?? "";
    const address2 = clientInfo.address2 ?? "";
    const telNumber = `TEL：${clientInfo.telNumber}`;
    if (address1 && address2) {
      worksheet.getCell("C15").value = address1;
      worksheet.getCell("C16").value = address2;
      worksheet.getCell("C17").value = telNumber;
    } else if (address1) {
      worksheet.getCell("C15").value = address1;
      worksheet.getCell("C16").value = telNumber;
    } else {
      worksheet.getCell("C15").value = telNumber;
    }

    // ダウンロード
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `納品書_${orderInfo.orderNo}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.log(e);
    openFailedToast(messages.MSGE021);
  } finally {
    loading.value = false;
  }
};
</script>

<!-- 受発注登録ボタンレイアウト -->
<style>
.btn-receive {
  background-color: #fc9503 !important;
  border-color: #fc9503 !important;
  color: #fff !important;
}

.btn-receive:hover {
  background-color: #e68600 !important;
  border-color: #e68600 !important;
  color: #fff !important;
}

.btn-receive:focus,
.btn-receive:focus-visible {
  box-shadow: 0 0 0 0.25rem rgba(252, 149, 3, 0.25) !important;
}

.btn-sale {
  background-color: #02d943 !important;
  border-color: #02d943 !important;
  color: #fff !important;
}

.btn-sale:hover {
  background-color: #02be3b !important;
  border-color: #02be3b !important;
  color: #fff !important;
}

.btn-sale:focus,
.btn-sale:focus-visible {
  box-shadow: 0 0 0 0.25rem rgba(2, 217, 67, 0.25) !important;
}
</style>