import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import React, { KeyboardEvent, useRef } from "react";
import { ChecklistItem } from "./TaskSheet";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "../page";

function TaskChecklist({
  subtasks,
  setTasks,
}: {
  subtasks: ChecklistItem[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const adjustTextAreaHeight = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      setTimeout(() => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }, 0);
    }
  };

  const focusOnItem = (id: number) => {
    setTimeout(() => {
      const input = document.querySelector(
        `textarea[data-id="${id}"]`
      ) as HTMLTextAreaElement | null;

      if (input) {
        input.focus();
        const length = input.value.length;
        input.setSelectionRange(length, length);
      }
    }, 0);
  };

  const addItem = () => {
    const newId = Math.max(0, ...subtasks.map((item) => item.id)) + 1;
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        checklist: [...subtasks, { id: newId, text: "", checked: false }],
      }))
    );

    focusOnItem(newId);
  };

  const removeItem = (id: number) => {
    const currentIndex = subtasks.findIndex((item) => item.id === id);
    if (currentIndex > 0) {
      const previousItemId = subtasks[currentIndex - 1].id;
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          checklist: subtasks.filter((item) => item.id !== id),
        }))
      );
      focusOnItem(previousItemId);
    } else {
      const nextItemId = subtasks[currentIndex + 1].id;
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          checklist: subtasks.filter((item) => item.id !== id),
        }))
      );
      focusOnItem(nextItemId);
    }
  };

  const handleChecklistItemChange = (id: number, newText: string) => {
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        checklist: subtasks.map((item) =>
          item.id === id ? { ...item, text: newText } : item
        ),
      }))
    );
  };

  const toggleChecklistItem = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        checklist: subtasks.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        ),
      }))
    );
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>,
    item: ChecklistItem
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    } else if (e.key === "Backspace" && item.text === "") {
      if (subtasks.length > 1) {
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

      <div>
        {subtasks.map((item) => (
          <div key={item.id} className="flex items-start space-x-2 group">
            <div className="h-6 flex items-center mt-2">
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => toggleChecklistItem(item.id)}
              />
            </div>
            <Textarea
              ref={(textarea) => {
                if (textarea) {
                  setTimeout(() => {
                    textarea.style.height = "20px";
                    textarea.style.height = `${textarea.scrollHeight}px`;
                  }, 0);
                }
              }}
              className={`resize-none overflow-hidden  w-full border-none focus-visible:ring-0 shadow-none ${
                item.checked ? "line-through text-muted-foreground" : ""
              }`}
              onChange={(e) => {
                adjustTextAreaHeight();
                handleChecklistItemChange(item.id, e.target.value);
              }}
              onKeyDown={(e) => handleKeyDown(e, item)}
              value={item.text}
              placeholder="List item"
              data-id={item.id}
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
