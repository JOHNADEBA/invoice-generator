export function useInvoiceNumber(
  lastInvoiceNumber: string,
  setLastInvoiceNumber: (value: string) => void,
) {
  const generateNextInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthStr = String(month).padStart(2, "0");

    let nextNumber = 1;
    if (lastInvoiceNumber) {
      const match = lastInvoiceNumber.match(/INV-(\d{4})(\d{2})-(\d+)/);
      if (match) {
        const lastYear = parseInt(match[1]);
        const lastMonth = parseInt(match[2]);
        const lastSeq = parseInt(match[3]);
        if (year === lastYear && month === lastMonth) {
          nextNumber = lastSeq + 1;
        }
      }
    }

    const newNumber = `INV-${year}${monthStr}-${String(nextNumber).padStart(3, "0")}`;
    setLastInvoiceNumber(newNumber);
    return newNumber;
  };

  return { generateNextInvoiceNumber };
}
