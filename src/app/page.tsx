"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Invoice } from "@/types/invoice";
import { LineItemsTable } from "@/components/invoice/LineItemsTable";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";

import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";

export default function Page() {
  const today = new Date().toISOString().split("T")[0];

  const [currency, setCurrency] = useState<Invoice["currency"]>("USD");
  const [language, setLanguage] = useState<Invoice["language"]>("en");

  const [items, setItems] = useState([
    {
      id: uuid(),
      description: "",
      quantity: "1",
      price: "0",
    },
  ]);

  const [invoiceNumber, setInvoiceNumber] = useState("001");

  const [issueDate, setIssueDate] = useState(today);

  const [dueDate, setDueDate] = useState(today);

  const [fromName, setFromName] = useState("");
  const [fromAddress, setFromAddress] = useState("");

  const [toName, setToName] = useState("");
  const [toAddress, setToAddress] = useState("");

  const [paymentDetails, setPaymentDetails] = useState("");

  const [notes, setNotes] = useState("");

  const invoice: Invoice = {
    invoiceNumber,
    issueDate,
    dueDate,
    currency,
    language,
    from: {
      name: fromName,
      address: fromAddress,
    },
    to: {
      name: toName,
      address: toAddress,
    },
    items,
    paymentDetails,
    notes,
  };

  const downloadPDF = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoice,
      }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoiceNumber}.pdf`;
    a.click();
  };

  return (
    <main className="px-4 py-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
        {/* HEADER CONTROLS */}
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end">
          {/* LEFT SIDE */}
          <div className="space-y-3 w-full md:w-auto">
            <Input
              placeholder="Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />

            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-4 w-full md:w-auto md:flex-row md:gap-6">
            <div className="w-full md:w-auto">
              <label className="block mb-1 font-medium">Currency</label>
              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value as Invoice["currency"])
                }
                className="border rounded-md px-4 py-2 w-full"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="NGN">NGN</option>
              </select>
            </div>

            <div className="w-full md:w-auto">
              <label className="block mb-1 font-medium">Language</label>
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as Invoice["language"])
                }
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

        {/* COMPANY SECTION */}
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
            />
          </div>

          <div className="w-full md:w-1/2 space-y-3 md:text-right">
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
            />
          </div>
        </div>

        {/* LINE ITEMS */}
        <div className="overflow-x-auto">
          <LineItemsTable
            items={items}
            setItems={setItems}
            currency={currency}
          />
        </div>

        {/* PAYMENT + NOTES */}
        <div className="space-y-6">
          <TextArea
            placeholder="Payment Details"
            value={paymentDetails}
            onChange={(e) => setPaymentDetails(e.target.value)}
          />

          <TextArea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          onClick={downloadPDF}
          className="w-full md:w-auto"
        >
          Download PDF
        </Button>

        {/* PREVIEW */}
        <div className="overflow-x-auto">
          <InvoicePreview invoice={invoice} />
        </div>
      </div>
    </main>
  );
}
