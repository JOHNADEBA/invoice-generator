import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Get email from the request body (sent from client)
    const { email } = await req.json();

    if (!email) {
      return new Response("Email required", { status: 400 });
    }

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { email },
      create: {
        id: userId,
        email,
      },
    });

    return Response.json({ success: true, user });
  } catch (error) {
    console.error("Failed to sync user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
