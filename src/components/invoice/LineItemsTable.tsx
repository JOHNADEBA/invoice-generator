"use client";

import { LineItem, Currency } from "@/types/invoice";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { calculateLineTotal, formatNumber } from "@/lib/calculation";
import { v4 as uuid } from "uuid";

interface Props {
  items: LineItem[];
  setItems: (items: LineItem[]) => void;
  currency: Currency;
}

export function LineItemsTable({ items, setItems }: Props) {
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
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={item.id} className="border rounded-lg p-4 md:border-0 md:p-0">
          {/* MOBILE LAYOUT */}
          <div className="flex justify-between items-center mb-3 md:hidden">
            <span className="font-medium">Item {index + 1}</span>
            <Button size="sm" onClick={() => removeItem(item.id)}>
              X
            </Button>
          </div>

          <div className="flex flex-col gap-3 md:grid md:grid-cols-[40px_1fr_100px_120px_120px_60px] md:gap-2 md:items-center">
            {/* INDEX (Desktop only) */}
            <div className="hidden md:block">{index + 1}.</div>

            {/* DESCRIPTION */}
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                updateItem(item.id, "description", e.target.value)
              }
            />

            {/* QTY */}
            <Input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={item.quantity}
              onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
            />

            {/* PRICE */}
            <Input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={item.price}
              onChange={(e) => updateItem(item.id, "price", e.target.value)}
            />

            {/* TOTAL */}
            <div className="text-right font-medium">
              {formatNumber(calculateLineTotal(item))}
            </div>

            {/* DELETE (Desktop only) */}
            <div className="hidden md:block">
              <Button size="sm" onClick={() => removeItem(item.id)}>
                X
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addItem} className="w-full md:w-auto">
        Add Item
      </Button>
    </div>
  );
}
