interface HistoryHeaderProps {
  userName: string;
  invoiceCount: number;
}

export function HistoryHeader({ userName, invoiceCount }: HistoryHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold">Invoice History</h1>
      <p className="mt-1">
        Welcome back, {userName}! You have {invoiceCount} saved invoice
        {invoiceCount !== 1 ? "s" : ""}.
      </p>
    </div>
  );
}