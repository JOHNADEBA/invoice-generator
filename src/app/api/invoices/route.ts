import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    
    return Response.json(invoices);
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const data = await req.json();
    
    // Remove fields that don't exist in schema
    const { total, email, ...invoiceData } = data;
    
    const invoice = await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber: invoiceData.invoiceNumber,
        issueDate: invoiceData.issueDate,
        dueDate: invoiceData.dueDate,
        currency: invoiceData.currency,
        language: invoiceData.language,
        fromName: invoiceData.fromName || "",
        fromAddress: invoiceData.fromAddress || "",
        toName: invoiceData.toName || "",
        toAddress: invoiceData.toAddress || "",
        paymentDetails: invoiceData.paymentDetails || "",
        notes: invoiceData.notes || "",
        items: invoiceData.items,
      },
    });

    return Response.json(invoice);
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}