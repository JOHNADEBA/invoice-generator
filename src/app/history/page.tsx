"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useInvoices } from "@/hooks/useInvoices";
import { NotSignedIn } from "./NotSignedIn";
import { HistoryHeader } from "./HistoryHeader";
import { InvoiceTable } from "./InvoiceTable";
import { EmptyState } from "./EmptyState";

export default function HistoryPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { invoices, loading, loadInvoices, deleteInvoice } = useInvoices();

  useEffect(() => {
    // Only load invoices if user is signed in
    if (isLoaded && isSignedIn) {
      loadInvoices();
    }
  }, [isLoaded, isSignedIn]);

  // Wait for Clerk to load
  if (!isLoaded) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not signed in - show login prompt
  if (!isSignedIn) {
    return <NotSignedIn />;
  }

  // Loading invoices
  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-gray-500">Loading your invoices...</p>
          </div>
        </div>
      </div>
    );
  }

  // No invoices
  if (invoices.length === 0) {
    return <EmptyState />;
  }

  // Show invoices
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <HistoryHeader
          userName={
            user?.firstName ||
            user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
            "User"
          }
          invoiceCount={invoices.length}
        />

        <InvoiceTable
          invoices={invoices}
          onView={viewInvoice}
          onDownload={downloadInvoice}
          onDelete={deleteInvoice}
        />

        <div className="flex gap-3 mt-3">
          <Link href="/">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

// Helper functions moved outside component
const viewInvoice = (invoice: any) => {
  localStorage.setItem("invoice_draft", JSON.stringify(invoice));
  window.location.href = "/";
};

const downloadInvoice = async (invoice: any) => {
  try {
    const pdfInvoice = {
      invoiceNumber: invoice.invoiceNumber,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      currency: invoice.currency,
      language: invoice.language,
      from: {
        name: invoice.fromName,
        address: invoice.fromAddress,
      },
      to: {
        name: invoice.toName,
        address: invoice.toAddress,
      },
      items: invoice.items,
      paymentDetails: invoice.paymentDetails,
      notes: invoice.notes,
    };

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice: pdfInvoice }),
    });

    if (!res.ok) throw new Error("Failed to generate PDF");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download invoice:", error);
    alert("Failed to download invoice. Please try again.");
  }
};
