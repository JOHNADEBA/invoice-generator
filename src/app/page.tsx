"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { InvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoiceActions } from "@/components/invoice/InvoiceActions";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { useInvoiceForm } from "@/hooks/useInvoiceForm";
import { useAutoSave } from "@/hooks/useAutoSave";

export default function Page() {
  const [isClient, setIsClient] = useState(false);
  const { isSignedIn } = useUser();

  const form = useInvoiceForm();

  const { isSaving, lastSaved, hasChanges } = useAutoSave(
    "invoice_draft",
    form.invoice,
    3000,
  );

  // Load from history on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("invoice_draft");
    if (savedDraft) {
      const data = JSON.parse(savedDraft);
      form.loadFromHistory(data);
      localStorage.removeItem("invoice_draft");
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-generate invoice number
  useEffect(() => {
    if (isClient && !form.invoiceNumber && !form.isLoadingFromHistory) {
      form.setInvoiceNumber(form.generateNextInvoiceNumber());
    }
  }, [isClient, form.invoiceNumber]);

  // Auto-save to database
  useEffect(() => {
    if (
      isSignedIn &&
      isClient &&
      form.invoiceNumber &&
      !form.isSavingToDb &&
      !form.isLoadingFromHistory
    ) {
      const hasData =
        form.fromName ||
        form.toName ||
        form.items.some((item) => item.description);
      if (!hasData) return;

      const timeoutId = setTimeout(() => {
        form.saveToDatabase();
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [form.invoice, isSignedIn, isClient]);

  if (!isClient) return null;

  return (
    <main className="px-4 py-6 md:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
        <InvoiceHeader
          isSaving={isSaving}
          hasChanges={hasChanges}
          lastSaved={lastSaved}
          isSignedIn={isSignedIn ?? false}
          lastDbSave={form.lastDbSave}
          onNewInvoice={form.newInvoice}
        />

        <InvoiceForm
          invoiceNumber={form.invoiceNumber}
          setInvoiceNumber={form.setInvoiceNumber}
          issueDate={form.issueDate}
          setIssueDate={form.setIssueDate}
          dueDate={form.dueDate}
          setDueDate={form.setDueDate}
          currency={form.currency as any}
          setCurrency={form.setCurrency}
          language={form.language}
          setLanguage={form.setLanguage}
          fromName={form.fromName}
          setFromName={form.setFromName}
          fromAddress={form.fromAddress}
          setFromAddress={form.setFromAddress}
          toName={form.toName}
          setToName={form.setToName}
          toAddress={form.toAddress}
          setToAddress={form.setToAddress}
          paymentDetails={form.paymentDetails}
          setPaymentDetails={form.setPaymentDetails}
          notes={form.notes}
          setNotes={form.setNotes}
          items={form.items}
          setItems={form.setItems}
        />

        <InvoiceActions
          onClear={form.clearForm}
          onDownload={form.downloadPDF}
        />

        <div className="overflow-x-auto">
          <h2 className="font-semibold text-lg mb-4">Preview</h2>
          <InvoicePreview invoice={form.invoice} />
        </div>
      </div>
    </main>
  );
}
