


/**
 * 金額計算
 */
export function calcValue(amount, price) {
  // 消費税10%(2025/09/03現在)
  const tax = 0.1;

  // 金額計算
  const value = price * amount;
  // 消費税額計算(小数点以下切り捨て)
  const taxValue = Math.floor(value * tax);
  // 合計金額計算
  const totalValue = value + taxValue;

  // 結果の格納
  const results = {
    value: value,
    taxValue: taxValue,
    totalValue: totalValue,
  };

  return results;
}
