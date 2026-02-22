export type Language = "en" | "sl" | "it" | "fr" | "de";

export interface LineItem {
  id: string;
  description: string;
  quantity: string;
  price: string;
}

export interface InvoiceParty {
  name: string;
  address: string;
  email?: string;
}

export type Currency = "USD" | "EUR" | "GBP" | "NGN";

export interface Invoice {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: Currency;
  language: Language;

  from: InvoiceParty;
  to: InvoiceParty;

  paymentDetails?: string;
  notes?: string;

  items: LineItem[];
}
