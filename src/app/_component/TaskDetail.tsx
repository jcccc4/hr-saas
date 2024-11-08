import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import React, { useEffect, useRef } from "react";
import { Task } from "../page";
import { Trash2 } from "lucide-react";
import ButtonGroup from "./ButtonGroup";
import { Textarea } from "@/components/ui/textarea";
type TaskDetailProps = {
  task: Task;
  toggleTask: (id: number) => void;
  removeTask: (id: number) => void;
};
function TaskDetail({ task, toggleTask, removeTask }: TaskDetailProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [task.description]);
  return (
    <Sheet>
      <li className="flex items-center space-x-2 bg-secondary p-2 rounded-md">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => toggleTask(task.id)}
        />
        <SheetTrigger asChild>
          <div
            className={`flex-grow cursor-pointer ${
              task.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.text}
          </div>
        </SheetTrigger>
        <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove task</span>
        </Button>
      </li>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex flex-col w-full items-start gap-2">
            <Input defaultValue={task.text} />
            <ButtonGroup />
          </SheetTitle>
        </SheetHeader>
        <Textarea
          ref={textAreaRef}
          className="resize-none overflow-hidden min-h-[100px]"
          onChange={adjustTextareaHeight}
          defaultValue={task.description}
        />
        <div className="flex-grow  bg-slate-500"></div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TaskDetail;
