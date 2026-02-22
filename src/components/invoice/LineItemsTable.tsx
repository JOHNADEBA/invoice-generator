"use client";

import { LineItem, Currency } from "@/types/invoice";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { calculateLineTotal, formatCurrency } from "@/lib/calculation";
import { v4 as uuid } from "uuid";

interface Props {
  items: LineItem[];
  setItems: (items: LineItem[]) => void;
  currency: Currency;
}

export function LineItemsTable({ items, setItems, currency }: Props) {
  const updateItem = (id: string, field: keyof LineItem, value: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: uuid(),
        description: "",
        quantity: "1",
        price: "0",
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="grid grid-cols-[40px_1fr_120px_140px_140px_60px] gap-2 items-center"
        >
          <div>{index + 1}.</div>

          <Input
            placeholder="Description"
            value={item.description}
            onChange={(e) => updateItem(item.id, "description", e.target.value)}
          />

          <Input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={item.quantity}
            onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
          />

          <Input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={item.price}
            onChange={(e) => updateItem(item.id, "price", e.target.value)}
          />

          <div className="text-right">
            {formatCurrency(calculateLineTotal(item), currency)}
          </div>

          <Button onClick={() => removeItem(item.id)}>X</Button>
        </div>
      ))}

      <Button onClick={addItem}>Add Item</Button>
    </div>
  );
}
