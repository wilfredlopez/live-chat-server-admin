export const formatCentsToDollars = function(value: any) {
  value = (value + "").replace(/[^\d.-]/g, "")
  value = parseFloat(value)
  return value ? value / 100 : 0
}
