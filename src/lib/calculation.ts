import { LineItem, Currency, Language } from "@/types/invoice";

function parse(value: string) {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

export function calculateLineTotal(item: LineItem) {
  return parse(item.quantity) * parse(item.price);
}

export function calculateSubtotal(items: LineItem[]) {
  return items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
}

export function formatNumber(amount: number, language: Language = "en") {
  return new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrency(
  amount: number,
  currency: Currency,
  language: Language = "en",
) {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency,
  }).format(amount);
}
