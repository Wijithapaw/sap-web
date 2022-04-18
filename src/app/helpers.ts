export const dateHelpers = {
  dateMonthsAgo,
  toIsoString
}

export const currencyHelpers = {
  toCurrency
}

function dateMonthsAgo(months: number) {
  var d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

function toIsoString(value: Date) {
  return value.toLocaleDateString('en-CA')
}

function toCurrency(amount: number) {
  return amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}