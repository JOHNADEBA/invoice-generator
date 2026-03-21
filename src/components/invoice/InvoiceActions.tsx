import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface InvoiceActionsProps {
  onClear: () => void;
  onDownload: () => void;
}

export function InvoiceActions({ onClear, onDownload }: InvoiceActionsProps) {
  return (
    <div className="flex flex-row gap-3">
      <Button
        variant="danger"
        onClick={onClear}
        className="border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Clear All
      </Button>
      <Button
        variant="outline"
        onClick={onDownload}
        className="flex items-center justify-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download PDF
      </Button>
    </div>
  );
}
