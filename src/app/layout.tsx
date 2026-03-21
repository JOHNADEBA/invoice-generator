"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import "./globals.css";

function UserSync({ children }: { children: React.ReactNode }) {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
        try {
          const response = await fetch("/api/user/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.primaryEmailAddress.emailAddress,
            }),
          });

          if (!response.ok) {
          } else {
            const data = await response.json();
          }
        } catch (error) {}
      }
    };

    syncUser();
  }, [isSignedIn, user]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-50">
          <UserSync>
            <Header />
            {children}
          </UserSync>
        </body>
      </html>
    </ClerkProvider>
  );
}
