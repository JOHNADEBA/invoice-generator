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
    <main className="p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Controls */}
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Input
              placeholder="Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />

            <div className="flex gap-4">
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
          {/* Currency Selector */}
          <div>
            <label className="block mb-1 font-medium">Currency</label>
            <select
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value as Invoice["currency"])
              }
              className="border rounded-md px-4 py-2"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="NGN">NGN</option>
            </select>
          </div>{" "}
          <div>
            <label className="block mb-1 font-medium">Language</label>
            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as Invoice["language"])
              }
              className="border rounded-md px-4 py-2"
            >
              <option value="en">English</option>
              <option value="sl">Slovenščina</option>
              <option value="it">Italiano</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Company Section */}
        <div className="flex justify-between">
          <div className="w-[400px] space-y-3">
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

          <div className="w-[400px] space-y-3 text-right">
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

        <LineItemsTable items={items} setItems={setItems} currency={currency} />

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

        <Button onClick={downloadPDF}>Download PDF</Button>

        <InvoicePreview invoice={invoice} />
      </div>
    </main>
  );
}
