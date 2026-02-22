import { Invoice } from "@/types/invoice";
import {
  calculateSubtotal,
  calculateLineTotal,
  formatCurrency,
  formatNumber,
} from "@/lib/calculation";
import { translations } from "@/lib/translations";

interface Props {
  invoice: Invoice;
}

export function InvoicePreview({ invoice }: Props) {
  const subtotal = calculateSubtotal(invoice.items);
  const t = translations[invoice.language];

  return (
    <div
      id="invoice-preview"
      className="bg-white text-black mx-auto w-full max-w-[800px] p-6 md:p-12 rounded-lg"
    >
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:justify-between md:mb-10 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{t.invoice}</h1>

        <div className="md:text-right space-y-1 text-sm md:text-base">
          <p>
            {t.invoiceNumber}: {invoice.invoiceNumber}
          </p>
          <p>
            {t.issue}: {invoice.issueDate}
          </p>
          <p>
            {t.due}: {invoice.dueDate}
          </p>
        </div>
      </div>

      {/* Companies */}
      <div className="flex flex-col gap-8 md:flex-row md:justify-between mb-8 md:mb-10">
        <div className="w-full md:w-[350px]">
          <h2 className="font-semibold mb-2">{t.from}</h2>

          <p className="font-medium">{invoice.from.name}</p>

          <p className="whitespace-pre-line text-sm md:text-base">
            {invoice.from.address}
          </p>
        </div>

        <div className="w-full md:w-[350px] md:text-right">
          <h2 className="font-semibold mb-2">{t.to}</h2>

          <p className="font-medium">{invoice.to.name}</p>

          <p className="whitespace-pre-line text-sm md:text-base">
            {invoice.to.address}
          </p>
        </div>
      </div>

      {/* Table (scrollable on mobile) */}
      <div className="overflow-x-auto">
        <table className="w-full border-t border-b text-sm md:text-base min-w-[600px]">
          <thead>
            <tr>
              <th className="py-2 text-left w-[40px]">#</th>
              <th className="text-left">{t.description}</th>
              <th className="text-center w-[80px]">{t.qty}</th>
              <th className="text-center w-[100px]">{t.price}</th>
              <th className="text-right w-[100px]">{t.total}</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="py-2">{index + 1}</td>

                <td>{item.description}</td>

                <td className="text-center">
                  {formatNumber(
                    parseFloat(item.quantity) || 0,
                    invoice.language,
                  )}
                </td>

                <td className="text-center">
                  {formatNumber(parseFloat(item.price) || 0, invoice.language)}
                </td>

                <td className="text-right">
                  {formatNumber(calculateLineTotal(item), invoice.language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="text-right mt-6 text-lg md:text-xl font-semibold">
        {t.total}:{" "}
        {formatCurrency(subtotal, invoice.currency, invoice.language)}
      </div>

      {/* Payment */}
      {invoice.paymentDetails && (
        <div className="mt-8">
          <h3 className="font-semibold mb-1">{t.paymentDetails}</h3>
          <p className="whitespace-pre-line text-sm md:text-base">
            {invoice.paymentDetails}
          </p>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-6">
          <h3 className="font-semibold mb-1">{t.notes}</h3>
          <p className="whitespace-pre-line text-sm md:text-base">
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  );
}
