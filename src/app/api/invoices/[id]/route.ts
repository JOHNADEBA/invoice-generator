import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!invoice) return new Response("Not found", { status: 404 });

    return Response.json(invoice);
  } catch (error) {
    console.error("Failed to fetch invoice:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const { id } = await params;
    const data = await req.json();

    // Verify the invoice belongs to the user
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingInvoice) {
      return new Response("Invoice not found", { status: 404 });
    }

    // Remove fields that don't exist in schema
    const { total, email, ...updateData } = data;
    
    // Only update if there are actual changes
    if (Object.keys(updateData).length === 0) {
      return Response.json(existingInvoice);
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
    });

    return Response.json(invoice);
  } catch (error) {
    console.error("Failed to update invoice:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const { id } = await params;
    
    // Verify the invoice belongs to the user
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!invoice) {
      return new Response("Invoice not found", { status: 404 });
    }

    await prisma.invoice.delete({
      where: { id },
    });

    return new Response("Deleted", { status: 200 });
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}