import dayjs from "dayjs";

export const dateHelpers = {
  dateMonthsAgo,
  toIsoString,
  toDate,
  toDisplayString,
  toShortDateString,
  toIsoString2
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

function toDisplayString(date: string) {
  return dayjs(date).format("YYYY-MM-DD h:mm a");
}

function toShortDateString(date: string) {
  return dayjs(date).format("MM/DD/YY");
}

function toIsoString2(date: string) {
  return dayjs(date).format("YYYY-MM-DD");
}

function toCurrency(amount: number) {
  return amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
