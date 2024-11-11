"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Task } from "../page";
import ButtonGroup from "./ButtonGroup";
import { Plus, Trash2 } from "lucide-react";
import TaskChecklist from "./TaskChecklist";

type TaskDetailProps = {
  task: Task;
  toggleTask: (id: number) => void;
  removeTask: (id: number) => void;
};

function TaskDetail({ task, toggleTask, removeTask }: TaskDetailProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextAreaHeight = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextAreaHeight();
  }, [task.description]);

  const taskItemContent = (
    <>
      <Checkbox
        onClick={(e) => e.stopPropagation()}
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => toggleTask(task.id)}
      />
      <div
        className={`flex-grow cursor-pointer ${
          task.completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {task.text}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          removeTask(task.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Remove task</span>
      </Button>
    </>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <li className="flex items-center space-x-2 bg-secondary p-2 rounded-md">
          {taskItemContent}
        </li>
      </SheetTrigger>

      <SheetContent className="flex flex-col h-[100vh] overflow-y-auto">
        <div className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="flex flex-col w-full items-start gap-2">
              <Input
                className="border-none focus-visible:ring-0 text-lg"
                defaultValue={task.text}
              />
              <ButtonGroup />
            </SheetTitle>
          </SheetHeader>
          <div className="flex-grow overflow-y-auto">
            <Textarea
              ref={textAreaRef}
              className="resize-none min-h-[100px] w-full border-none focus-visible:ring-0 shadow-none"
              onChange={adjustTextAreaHeight}
              defaultValue={task.description}
            />
            <TaskChecklist />
          </div>

          <SheetFooter className="flex flex-row justify-between mt-2">
            <Button type="submit">Customize with AI</Button>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default TaskDetail;
