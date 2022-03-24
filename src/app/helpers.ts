export const dateHelpers = {
  dateMonthsAgo,
  toIsoString
}

function dateMonthsAgo(months: number) {
  var d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

function toIsoString(value: Date) {
  return value.toLocaleDateString('en-CA')
}