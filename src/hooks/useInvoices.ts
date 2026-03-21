import { useState } from "react";

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
  language: string;
  fromName: string;
  fromAddress: string;
  toName: string;
  toAddress: string;
  paymentDetails?: string;
  notes?: string;
  items: LineItem[];
  createdAt: string;
  updatedAt: string;
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [loading, setLoading] = useState(false);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices");
      
      // Handle unauthorized (not signed in)
      if (res.status === 401) {
        setInvoices([]);
        setLoading(false);
        return;
      }
      
      if (!res.ok) {
        throw new Error(`Failed to fetch invoices: ${res.status}`);
      }
      const data = await res.json();
      setInvoices(data);
    } catch (error) {
      console.error("Failed to load invoices:", error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return false;

    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInvoices(invoices.filter((inv) => inv.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      return false;
    }
  };

  return {
    invoices,
    loading,
    loadInvoices,
    deleteInvoice,
  };
}