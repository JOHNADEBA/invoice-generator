import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { LineItemsTable } from "@/components/invoice/LineItemsTable";
import { Currency } from "@/types/invoice";

interface InvoiceFormProps {
  invoiceNumber: string;
  setInvoiceNumber: (value: string) => void;
  issueDate: string;
  setIssueDate: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  currency: Currency;
  setCurrency: (value: Currency) => void;
  language: string;
  setLanguage: (value: string) => void;
  fromName: string;
  setFromName: (value: string) => void;
  fromAddress: string;
  setFromAddress: (value: string) => void;
  toName: string;
  setToName: (value: string) => void;
  toAddress: string;
  setToAddress: (value: string) => void;
  paymentDetails: string;
  setPaymentDetails: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  items: any[];
  setItems: (value: any) => void;
}

export function InvoiceForm({
  invoiceNumber,
  setInvoiceNumber,
  issueDate,
  setIssueDate,
  dueDate,
  setDueDate,
  currency,
  setCurrency,
  language,
  setLanguage,
  fromName,
  setFromName,
  fromAddress,
  setFromAddress,
  toName,
  setToName,
  toAddress,
  setToAddress,
  paymentDetails,
  setPaymentDetails,
  notes,
  setNotes,
  items,
  setItems,
}: InvoiceFormProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      {/* Invoice Number and Dates */}
      <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end">
        <div className="space-y-3 w-full md:w-auto">
          <Input
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Issue Date
              </label>
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                min={today}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={today}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto md:flex-row md:gap-6">
          <div className="w-full md:w-auto">
            <label className="block mb-1 font-medium">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="border rounded-md px-4 py-2 w-full"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="NGN">NGN (₦)</option>
            </select>
          </div>

          <div className="w-full md:w-auto">
            <label className="block mb-1 font-medium">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded-md px-4 py-2 w-full"
            >
              <option value="en">English</option>
              <option value="sl">Slovenščina</option>
              <option value="it">Italiano</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Company Section */}
      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
        <div className="w-full md:w-1/2 space-y-3">
          <h2 className="font-semibold text-lg">From</h2>
          <Input
            placeholder="Company Name"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
          />
          <TextArea
            placeholder="Company Address (each line will appear on invoice)"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            rows={3}
          />
        </div>

        <div className="w-full md:w-1/2 space-y-3">
          <h2 className="font-semibold text-lg">To</h2>
          <Input
            placeholder="Client Name"
            value={toName}
            onChange={(e) => setToName(e.target.value)}
          />
          <TextArea
            placeholder="Client Address (each line will appear on invoice)"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="overflow-x-auto">
        <LineItemsTable items={items} setItems={setItems} currency={currency} />
      </div>

      {/* Payment + Notes */}
      <div className="space-y-6">
        <TextArea
          placeholder="Payment Details (bank account, payment methods, etc.)"
          value={paymentDetails}
          onChange={(e) => setPaymentDetails(e.target.value)}
          rows={3}
        />
        <TextArea
          placeholder="Notes (terms, conditions, thank you message)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}
