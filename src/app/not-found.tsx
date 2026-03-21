"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Home, Plus, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center py-20">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-8xl md:text-9xl font-bold mb-4"
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-semibold mb-4"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg max-w-md mx-auto mb-8"
        >
          The invoice you're looking for doesn't exist or has been moved. Let's
          get you back to creating invoices.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link href="/">
            <Button
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2 sm:w-auto"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Create New Invoice
            </Button>
          </Link>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="border-t border-gray-200 pt-8"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <HelpCircle className="h-4 w-4" />
            <span>Need help?</span>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to dashboard
            </Link>
            <span>or</span>
            <Link href="/history" className="text-blue-600 hover:underline">
              view your invoices
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-100/20 rounded-full blur-3xl -z-10" />
      </div>
    </main>
  );
}
