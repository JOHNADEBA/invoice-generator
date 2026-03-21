"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { FileText, History, LogIn } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <header className="border-b border-gray-200 sticky top-0 z-50 bg-inherit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-lg ">Invoice Generator</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {/* Only show History button when signed in */}
            {isSignedIn && (
              <Link
                href="/history"
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105",
                )}
              >
                <History className="h-4 w-4" />
                History
              </Link>
            )}

            {/* User Button or Sign In */}
            {isSignedIn ? (
              <UserButton />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignIn}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
