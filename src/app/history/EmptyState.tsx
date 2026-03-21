import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyState() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-12 rounded-lg border border-gray-200">
          <FileText className="h-12 w-12 mx-auto mb-3" />
          <h3 className="text-lg font-medium">No saved invoices yet</h3>
          <p className="mt-1 max-w-md mx-auto">
            When you create and save invoices, they will appear here for easy
            access and management.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="mt-6 px-4 py-2 rounded-md transition-colors"
          >
            Create Your First Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
