import { SignInButton } from "@clerk/nextjs";
import { FileText, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NotSignedIn() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to view your invoices
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account or sign in to see your saved invoice history. Your
            invoices are securely stored and accessible from anywhere.
          </p>
          <SignInButton mode="modal">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign In to View History
            </Button>
          </SignInButton>
          <p className="text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <a href="/sign-up" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
