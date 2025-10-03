// 消費税10%(2025/10現在)
const taxRate = 0.1;

/**
 * 税込金額計算
 */
export function calcTax(price) {
  // 消費税額を計算(小数点以下切り捨て)
  const tax = Math.floor(price * taxRate);
  // 消費税額を含めた金額を計算
  const pricePlusTax = price + tax;

  //計算結果を返す
  return {
    tax: tax,
    pricePlusTax: pricePlusTax,
  };
}
