import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
import { useLocalStorage } from "./useLocalStorage";
import { calculateSubtotal } from "@/lib/calculation";
import { Invoice } from "@/types/invoice";
import { useInvoiceNumber } from "./useInvoiceNumber";

export interface InvoiceFormData {
  invoiceNumber: string;
  setInvoiceNumber: (value: string) => void;
  issueDate: string;
  setIssueDate: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  currency: string;
  setCurrency: (value: any) => void;
  language: string;
  setLanguage: (value: any) => void;
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
  invoice: Invoice;
  isLoadingFromHistory: boolean;
  isSavingToDb: boolean;
  lastDbSave: Date | null;
  invoiceId: string | null;
  lastInvoiceNumber: string;
  setLastInvoiceNumber: (value: string) => void;
  loadFromHistory: (data: any) => void;
  saveToDatabase: () => Promise<void>;
  clearForm: () => void;
  newInvoice: () => void;
  downloadPDF: () => Promise<void>;
}

export function useInvoiceForm() {
  const today = new Date().toISOString().split("T")[0];
  const { isSignedIn } = useUser();
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [lastDbSave, setLastDbSave] = useState<Date | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [isLoadingFromHistory, setIsLoadingFromHistory] = useState(false);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useLocalStorage(
    "last_invoice_number",
    "",
  );

  const { generateNextInvoiceNumber } = useInvoiceNumber(
    lastInvoiceNumber,
    setLastInvoiceNumber,
  );

  const [invoiceNumber, setInvoiceNumber] = useLocalStorage(
    "invoice_number",
    "",
  );
  const [issueDate, setIssueDate] = useLocalStorage("issue_date", today);
  const [dueDate, setDueDate] = useLocalStorage("due_date", today);
  const [currency, setCurrency] = useLocalStorage("currency", "USD");
  const [language, setLanguage] = useLocalStorage("language", "en");
  const [fromName, setFromName] = useLocalStorage("from_name", "");
  const [fromAddress, setFromAddress] = useLocalStorage("from_address", "");
  const [toName, setToName] = useLocalStorage("to_name", "");
  const [toAddress, setToAddress] = useLocalStorage("to_address", "");
  const [paymentDetails, setPaymentDetails] = useLocalStorage(
    "payment_details",
    "",
  );
  const [notes, setNotes] = useLocalStorage("notes", "");
  const [items, setItems] = useLocalStorage("items", [
    { id: uuid(), description: "", quantity: "1", price: "0" },
  ]);

  const invoice: Invoice = {
    invoiceNumber,
    issueDate,
    dueDate,
    currency: currency as any,
    language: language as any,
    from: { name: fromName, address: fromAddress },
    to: { name: toName, address: toAddress },
    items,
    paymentDetails,
    notes,
  };

  const loadFromHistory = (data: any) => {
    setIsLoadingFromHistory(true);
    setInvoiceNumber(data.invoiceNumber || "");
    setIssueDate(data.issueDate || today);
    setDueDate(data.dueDate || today);
    setCurrency(data.currency || "USD");
    setLanguage(data.language || "en");
    setFromName(data.fromName || data.from?.name || "");
    setFromAddress(data.fromAddress || data.from?.address || "");
    setToName(data.toName || data.to?.name || "");
    setToAddress(data.toAddress || data.to?.address || "");
    setPaymentDetails(data.paymentDetails || "");
    setNotes(data.notes || "");
    if (data.items?.length) setItems(data.items);
    if (data.id) setInvoiceId(data.id);
    setIsLoadingFromHistory(false);
  };

  const saveToDatabase = async () => {
    if (!isSignedIn) return;
    if (
      !invoiceNumber &&
      !fromName &&
      !toName &&
      items.every((i) => !i.description)
    )
      return;

    setIsSavingToDb(true);
    try {
      const method = invoiceId ? "PATCH" : "POST";
      const url = invoiceId ? `/api/invoices/${invoiceId}` : "/api/invoices";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber,
          issueDate,
          dueDate,
          currency,
          language,
          fromName,
          fromAddress,
          toName,
          toAddress,
          paymentDetails,
          notes,
          items,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        if (!invoiceId) setInvoiceId(saved.id);
        setLastDbSave(new Date());
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSavingToDb(false);
    }
  };

  const clearForm = () => {
    if (confirm("Clear all data? This cannot be undone.")) {
      setInvoiceNumber(generateNextInvoiceNumber());
      setFromName("");
      setFromAddress("");
      setToName("");
      setToAddress("");
      setPaymentDetails("");
      setNotes("");
      setItems([{ id: uuid(), description: "", quantity: "1", price: "0" }]);
      setInvoiceId(null);
      localStorage.removeItem("invoice_draft");
    }
  };

  const newInvoice = () => {
    setInvoiceNumber(generateNextInvoiceNumber());
    setFromName("");
    setFromAddress("");
    setToName("");
    setToAddress("");
    setPaymentDetails("");
    setNotes("");
    setItems([{ id: uuid(), description: "", quantity: "1", price: "0" }]);
    setInvoiceId(null);
    localStorage.removeItem("invoice_draft");
  };

  const downloadPDF = async () => {
    try {
      if (
        isSignedIn &&
        (fromName || toName || items.some((i) => i.description))
      ) {
        await saveToDatabase();
      }
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice }),
      });
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      newInvoice();
    } catch (error) {
      console.error("Failed to download:", error);
      alert("Failed to generate PDF");
    }
  };

  return {
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
    invoice,
    isLoadingFromHistory,
    isSavingToDb,
    lastDbSave,
    invoiceId,
    lastInvoiceNumber,
    setLastInvoiceNumber,
    loadFromHistory,
    saveToDatabase,
    clearForm,
    newInvoice,
    downloadPDF,
    generateNextInvoiceNumber,
  };
}
