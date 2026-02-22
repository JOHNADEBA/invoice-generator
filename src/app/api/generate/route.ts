import { NextRequest } from "next/server";
import { generatePDF } from "@/lib/pdf";
import { formatCurrency, formatNumber } from "@/lib/calculation";
import { translations } from "@/lib/translations";
import type { Invoice } from "@/types/invoice";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { invoice }: { invoice: Invoice } = await req.json();
  const t = translations[invoice.language];

  const rows = invoice.items
    .map((item: any, index: number) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      const total = qty * price;

      return `
      <tr>
        <td class="col-index">${index + 1}</td>
        <td class="col-description">${item.description}</td>
        <td class="col-qty">${qty}</td>
        <td class="col-price">${formatNumber(price, invoice.language)}</td>
        <td class="col-total">${formatNumber(total, invoice.language)}</td>
      </tr>
    `;
    })
    .join("");

  const subtotal = invoice.items.reduce(
    (sum: number, item: any) =>
      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
    0,
  );

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        @page {
          margin: 40px;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          color: #111;
          margin: 0;
        }

        .container {
          width: 800px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 60px;
        }

        .title {
          font-size: 32px;
          font-weight: bold;
        }

        .invoice-meta {
          text-align: right;
          line-height: 1.6;
        }

        .companies {
          display: flex;
          justify-content: space-between;
          margin-bottom: 50px;
        }

        .company {
          width: 350px;
          line-height: 1.6;
          white-space: pre-line;
        }

        .company h3 {
          margin: 0 0 -18px 0;
          font-size: 14px;
        }

        .company-name {
          font-weight: 600;
          margin-bottom: -20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        thead {
          border-top: 1px solid #999;
          border-bottom: 1px solid #999;
        }

        th {
          text-align: left;
          padding: 10px 6px;
          font-size: 14px;
        }

        td {
          padding: 10px 6px;
          font-size: 14px;
        }

        tbody tr {
          border-bottom: 1px solid #eee;
        }

        .col-index {
          width: 40px;
        }

        .col-description {
          width: 45%;
        }

        .col-qty {
          width: 80px;
          text-align: center;
        }

        .col-price {
          width: 120px;
          text-align: center;
        }

        .col-total {
          width: 120px;
          text-align: right;
        }

        .total-section {
          text-align: right;
          font-size: 18px;
          font-weight: bold;
          margin-top: 20px;
        }

        .section-title {
          font-weight: 600;
          margin-bottom: -20px;
        }

        .notes,
        .payment {
          margin-top: 40px;
          line-height: 1.6;
          white-space: pre-line;
        }
      </style>
    </head>

    <body>
      <div class="container">

        <div class="header">
          <div class="title">${t.invoice}</div>
          <div class="invoice-meta">
            <div>${t.invoiceNumber}: ${invoice.invoiceNumber}</div>
            <div>${t.issue}: ${invoice.issueDate}</div>
            <div>${t.due}: ${invoice.dueDate}</div>
          </div>
        </div>

        <div class="companies">
          <div class="company">
            <h3>${t.from}</h3>
            <div class="company-name">${invoice.from.name}</div>
            <div>${invoice.from.address}</div>
          </div>

          <div class="company" style="text-align:right;">
            <h3>${t.to}</h3>
            <div class="company-name">${invoice.to.name}</div>
            <div>${invoice.to.address}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>${t.description}</th>
              <th style="text-align:center;">${t.qty}</th>
              <th style="text-align:center;">${t.price}</th>
              <th style="text-align:right;">${t.total}</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="total-section">
          ${t.total}: ${formatCurrency(subtotal, invoice.currency, invoice.language)}
        </div>

        ${
          invoice.paymentDetails
            ? `
        <div class="payment">
          <div class="section-title">${t.paymentDetails}</div>
          ${invoice.paymentDetails}
        </div>`
            : ""
        }

        ${
          invoice.notes
            ? `
        <div class="notes">
          <div class="section-title">${t.notes}</div>
          ${invoice.notes}
        </div>`
            : ""
        }

      </div>
    </body>
  </html>
  `;

  const pdfBuffer = await generatePDF(html);

  return new Response(Buffer.from(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
