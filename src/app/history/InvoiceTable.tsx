import {
  Eye,
  Download,
  Trash2,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";
import { calculateSubtotal } from "@/lib/calculation";

interface LineItem {
  id: string;
  description: string;
  quantity: string;
  price: string;
}

interface SavedInvoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  toName: string;
  items: LineItem[];
}

interface InvoiceTableProps {
  invoices: SavedInvoice[];
  onView: (invoice: SavedInvoice) => void;
  onDownload: (invoice: SavedInvoice) => void;
  onDelete: (id: string) => void;
}

export function InvoiceTable({
  invoices,
  onView,
  onDownload,
  onDelete,
}: InvoiceTableProps) {
  const calculateTotal = (items: LineItem[]) => calculateSubtotal(items);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium">
                Invoice #
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Client
                </div>
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium">
                Due Date
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium">
                <div className="flex items-center justify-end gap-1">
                  <DollarSign className="h-4 w-4" />
                  Amount
                </div>
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => {
              const total = calculateTotal(invoice.items);
              return (
                <tr key={invoice.id} className="transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {invoice.toName || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium">
                    {total.toLocaleString()} {invoice.currency}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(invoice)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Edit Invoice"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDownload(invoice)}
                        className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(invoice.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete Invoice"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
