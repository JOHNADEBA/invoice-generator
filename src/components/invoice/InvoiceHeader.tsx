import { Loader2, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface InvoiceHeaderProps {
  isSaving: boolean;
  hasChanges: boolean;
  lastSaved: Date | null;
  isSignedIn: boolean;
  lastDbSave: Date | null;
  onNewInvoice: () => void;
}

export function InvoiceHeader({
  isSaving,
  hasChanges,
  lastSaved,
  isSignedIn,
  lastDbSave,
  onNewInvoice,
}: InvoiceHeaderProps) {
  const SaveStatus = () => (
    <div className="flex items-center gap-2 text-sm">
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-gray-500">Auto-saving...</span>
        </>
      ) : hasChanges ? (
        <>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <span className="text-gray-500">Unsaved changes</span>
        </>
      ) : lastSaved ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-gray-500">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        </>
      ) : null}
      {isSignedIn && lastDbSave && (
        <span className="text-xs text-gray-400 ml-2">
          • Cloud saved {lastDbSave.toLocaleTimeString()}
        </span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end">
      <div>
        <h1 className="text-2xl font-bold">Create Invoice</h1>
        <SaveStatus />
        <p className="text-xs mt-1">
          {isSignedIn
            ? "Auto-saved to cloud • Changes saved every 5 seconds"
            : "Your work is automatically saved in your browser. Sign In to unlock all premium features"}
        </p>
      </div>

      <Button
        variant="outline"
        onClick={onNewInvoice}
        className="border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        New Invoice
      </Button>
    </div>
  );
}