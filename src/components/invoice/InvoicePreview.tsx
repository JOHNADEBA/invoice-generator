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
      className="bg-white p-12 text-black w-[800px] mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between mb-10">
        <h1 className="text-3xl font-bold">{t.invoice}</h1>

        <div className="text-right">
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
      <div className="flex justify-between mb-10">
        <div className="w-[350px]">
          <h2 className="font-semibold mb-2">{t.from}</h2>

          <p className="font-medium">{invoice.from.name}</p>

          <p className="whitespace-pre-line">{invoice.from.address}</p>
        </div>

        <div className="w-[350px] text-right">
          <h2 className="font-semibold mb-2">{t.to}</h2>

          <p className="font-medium">{invoice.to.name}</p>

          <p className="whitespace-pre-line">{invoice.to.address}</p>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-t border-b">
        <thead>
          <tr>
            <th className="w-[40px] py-2 text-left">#</th>
            <th className="w-[45%] text-left">{t.description}</th>
            <th className="w-[100px] text-center">{t.qty}</th>
            <th className="w-[120px] text-center">{t.price}</th>
            <th className="w-[120px] text-right">{t.total}</th>
          </tr>
        </thead>

        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={item.id} className="border-t">
              <td className="py-2">{index + 1}</td>

              <td>{item.description}</td>

              <td className="text-center">{item.quantity}</td>

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

      <div className="text-right mt-6 text-xl font-semibold">
        {t.total}: {/* {formatNumber(subtotal, invoice.language)} */}
        {formatCurrency(subtotal, invoice.currency, invoice.language)}
      </div>

      {invoice.paymentDetails && (
        <div className="mt-8">
          <h3 className="font-semibold">{t.paymentDetails}</h3>
          <p className="whitespace-pre-line">{invoice.paymentDetails}</p>
        </div>
      )}

      {invoice.notes && (
        <div className="mt-6">
          <h3 className="font-semibold">{t.notes}</h3>
          <p className="whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}
