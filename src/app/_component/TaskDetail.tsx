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
import { Trash2 } from "lucide-react";
import TaskChecklist from "./TaskChecklist";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Label } from "@/components/ui/label";

type TaskDetailProps = {
  task: Task;
  toggleTask: (id: number) => void;
  removeTask: (id: number) => void;
};
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

async function generateSubtasks(taskTitle: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Create a detailed subtask list for this task: "${taskTitle}". 
    Return only numbered subtasks, one per line. Keep it practical and actionable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const subtasks = text
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter((line) => line.length > 0);

    return subtasks;
  } catch (error) {
    console.error("Error generating subtasks:", error);
    return [];
  }
}

function TaskDetail({ task, toggleTask, removeTask }: TaskDetailProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const generatedSubtasks = await generateSubtasks(task.text);
      setSubtasks(generatedSubtasks);
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
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <div className="space-y-2">
              {subtasks.length > 0 ? (
                <ul className="space-y-2">
                  {subtasks.map((subtask, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Checkbox id={`subtask-${index}`} />
                      <Label htmlFor={`subtask-${index}`}>{subtask}</Label>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm">
                  {isGenerating
                    ? "Generating subtasks..."
                    : "Click generate to create AI-suggested subtasks"}
                </div>
              )}
            </div>
            <TaskChecklist />
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
    </Sheet>
  );
}

export default TaskDetail;
