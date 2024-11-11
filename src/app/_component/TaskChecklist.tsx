import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import React, { useState, KeyboardEvent } from "react";

type ChecklistItem = {
  id: number;
  text: string;
  checked: boolean;
};

function TaskChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 1, text: "", checked: false },
  ]);

  const focusOnItem = (id: number) => {
    setTimeout(() => {
      const input = document.querySelector(
        `input[data-id="${id}"]`
      ) as HTMLInputElement | null;

      if (input) {
        input.focus();
        const length = input.value.length;
        input.setSelectionRange(length, length);
      }
    }, 0);
  };

  const addItem = () => {
    const newId = Math.max(0, ...items.map((item) => item.id)) + 1;
    setItems((prev) => [...prev, { id: newId, text: "", checked: false }]);
    focusOnItem(newId);
  };

  const removeItem = (id: number) => {
    const currentIndex = items.findIndex((item) => item.id === id);
    if (currentIndex > 0) {
      // Get the ID and text of the item above the one being deleted
      const previousItemId = items[currentIndex - 1].id;
      setItems((prev) => prev.filter((item) => item.id !== id));
      focusOnItem(previousItemId);
    } else {
      const nextItemId = items[currentIndex + 1].id;
      setItems((prev) => prev.filter((item) => item.id !== id));
      focusOnItem(nextItemId);
    }
  };

  const handleChecklistItemChange = (id: number, newText: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: newText } : item))
    );
  };

  const toggleChecklistItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    item: ChecklistItem
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    } else if (e.key === "Backspace" && item.text === "") {
      if (items.length > 1) {
        e.preventDefault();
        removeItem(item.id);
      }
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Checklist</h3>
        <Button variant="outline" size="sm" onClick={addItem} className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-2 group">
            <Checkbox
              checked={item.checked}
              onCheckedChange={() => toggleChecklistItem(item.id)}
              className="mt-1"
            />
            <Input
              value={item.text}
              onChange={(e) =>
                handleChecklistItemChange(item.id, e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(e, item)}
              placeholder="List item"
              data-id={item.id}
              className={`flex-1 border-none focus-visible:ring-0 ${
                item.checked ? "line-through text-muted-foreground" : ""
              }`}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
              className="opacity-0 group-hover:opacity-100 h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskChecklist;
