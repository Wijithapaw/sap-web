export const dateHelpers = {
  dateMonthsAgo,
  toIsoString,
  toDate
}

export const currencyHelpers = {
  toCurrency
}

function dateMonthsAgo(months: number) {
  var d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

function toIsoString(value?: Date) {
  return value ? value.toLocaleDateString('en-CA') : ''
}

function toDate(valueStr?: string) {
  return valueStr ? new Date(valueStr) : undefined;
}

function toCurrency(amount: number) {
  return amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}