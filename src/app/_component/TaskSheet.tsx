"use client";
import React, { useEffect, useRef, useState } from "react";
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
import ButtonGroup from "../../components/ButtonGroup";
import { Trash2 } from "lucide-react";
import TaskChecklist from "./TaskChecklist";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useIsMobile } from "@/hooks/use-mobile";

type TaskDetailProps = {
  task: Task;
  toggleTask: (id: number) => void;
  removeTask: (id: number) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTask: Task;
  setActiveTaskId: React.Dispatch<React.SetStateAction<number | null>>;
};

export type ChecklistItem = {
  id: number;
  text: string;
  checked: boolean;
};

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

async function generateSubtasks(taskTitle: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a detailed subtask list for this task: "${taskTitle}". 
    Return only numbered subtasks, one per line. Keep it practical and actionable. Limit it to 5 items`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const newSubtasks = text
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter((line) => line.length > 0);

    const checklistItems: ChecklistItem[] = newSubtasks.map((text, index) => ({
      id: index + 1,
      text,
      checked: false,
    }));
    return checklistItems;
  } catch (error) {
    console.error("Error generating subtasks:", error);
    return [];
  }
}

function TaskSheet({
  task,
  toggleTask,
  removeTask,
  setTasks,
  activeTask,
  setActiveTaskId,
}: TaskDetailProps) {
  const isMobile = useIsMobile();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const generatedSubtasks = await generateSubtasks(task.text);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, checklist: generatedSubtasks } : t
        )
      );
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate subtasks. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
        className={`flex-grow cursor-pointer h-full flex items-center justify-between box-border border-b border-primary-foreground  ${
          task.completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        <p>{task.text}</p>
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
      </div>
    </>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        {task.id === activeTask.id ? (
          <li className="flex items-center pl-4 h-10 gap-2 rounded-md bg-primary-foreground">
            {taskItemContent}
          </li>
        ) : (
          <li
            onClick={() => setActiveTaskId(task.id)}
            className="flex items-center pl-4 h-10 gap-2 rounded-md"
          >
            {taskItemContent}
          </li>
        )}
      </SheetTrigger>

      {isMobile && (
        <SheetContent className="flex flex-col h-[100vh] overflow-y-auto">
          <div className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle className="flex flex-col w-full items-start gap-2">
                <Input
                  className="border-none focus-visible:ring-0 text-lg"
                  value={activeTask.text}
                />
                <ButtonGroup />
              </SheetTitle>
            </SheetHeader>
            <div className="flex-grow overflow-y-auto">
              <Textarea
                ref={textAreaRef}
                className="resize-none min-h-[100px] w-full border-none focus-visible:ring-0 shadow-none"
                onChange={adjustTextAreaHeight}
                value={activeTask.description}
              />
              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}

              <TaskChecklist
                setTasks={setTasks}
                activeTask={activeTask}
                setActiveTaskId={setActiveTaskId}
              />
            </div>

            <SheetFooter className="flex flex-row justify-between mt-2">
              <Button onClick={handleAIGenerate} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Customize with AI"}
              </Button>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
}

export default TaskSheet;
