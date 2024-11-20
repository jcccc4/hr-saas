"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef, useState } from "react";

import TaskSheet from "./_component/TaskSheet";
import ButtonGroup from "../components/ButtonGroup";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Textarea } from "@/components/ui/textarea";
import TaskChecklist from "./_component/TaskChecklist";
console.log("test")
export type ChecklistItem = {
  id: number;
  text: string;
  checked: boolean;
};

export type Task = {
  id: number;
  text: string;
  description: string;
  completed: boolean;
  checklist: ChecklistItem[];
};

const initialTasks: Task[] = [
  {
    id: 1,
    text: "Buy groceries",
    description: "try",
    completed: false,
    checklist: [],
  },
  {
    id: 2,
    text: "Finish work presentation",
    description: "test",
    completed: false,
    checklist: [],
  },
  {
    id: 3,
    text: "Go for a 30-minute walk",
    description: "",
    completed: true,
    checklist: [],
  },
  {
    id: 4,
    text: "Read a chapter of my book",
    description: "",
    completed: false,
    checklist: [],
  },
  {
    id: 5,
    text: "Call mom",
    description: "Read a chapter",
    completed: true,
    checklist: [],
  },
];

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskText, setNewTaskText] = useState("");
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const activeTask =
    tasks.find((task) => task.id === activeTaskId) || ({} as Task);

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  // Simplified handlers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTaskId) {
      updateTask(activeTaskId, { text: e.target.value });
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (activeTaskId) {
      updateTask(activeTaskId, { description: e.target.value });
      adjustTextAreaHeight();
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = (taskTitle: string) => {
    const task: Task = {
      id: tasks.length + 1,
      text: taskTitle,
      description: "",
      completed: false,
      checklist: [],
    };
    setTasks((prev) => {
      const newArray = prev.map((task) => ({ ...task, onFocus: false }));
      return [...newArray, task];
    });
    setActiveTaskId(task.id);
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Create a detailed subtask list for this task: "${activeTask?.text}". 
        Return only numbered subtasks, one per line. Keep it practical and actionable. Limit it to 5 items`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const newSubtasks = text
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter((line) => line.length > 0)
        .map((text, index) => ({
          id: index + 1,
          text,
          checked: false,
        }));

      // Update both tasks and activeTask
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === activeTask.id ? { ...task, checklist: newSubtasks } : task
        )
      );
     
    } catch (error) {
      console.error("Failed to generate subtasks:", error);
      setError("Failed to generate subtasks. Please try again. ");
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

  return (
    
      
      <div className="min-h-screen w-full flex flex-col ">
        <header className="bg-white px-4 pt-4 pb-2">
          <div className="flex gap-2">
            <SidebarTrigger key={"task"} />
            <h1 className="text-2xl font-semibold">To do List</h1>
          </div>
        </header>

        <main className="bg-primary-foreground flex flex-col flex-grow h-full">
          <Tabs defaultValue="today" className="h-full flex flex-col pb-2">
            <TabsList className="w-full flex justify-start bg-white rounded-non px-4">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="days">Next 7 days</TabsTrigger>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
            </TabsList>
            <TabsContent
              value="today"
              className="flex-1 grid  grid-cols-2 grid-rows-[118px_1fr] px-4 gap-2"
            >
              <Card className="p-4 w-full flex flex-col gap-2">
                <CardContent>
                  <Input
                    className="w-full border-none focus-visible:ring-0"
                    placeholder="What would you like to do?"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTaskText.trim()) {
                        addTask(newTaskText);
                        setNewTaskText("");
                      }
                    }}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <ButtonGroup />
                  <Button onClick={() => addTask(newTaskText)}>Add Task</Button>
                </CardFooter>
              </Card>
              <Card className="p-4 w-full flex flex-col gap-2 ">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Task List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <ul className="">
                      {tasks.map((task) => (
                        <TaskSheet
                          key={task.id}
                          task={task}
                          toggleTask={toggleTask}
                          removeTask={removeTask}
                          setTasks={setTasks}
                          activeTask={activeTask}
                          setActiveTaskId={setActiveTaskId}
                        />
                      ))}
                    </ul>
                    {tasks.length === 0 && (
                      <p className="text-center text-muted-foreground mt-4">
                        No tasks yet. Add some tasks to get started!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="relative hidden p-4 w-full md:flex flex-col col-end-3 row-start-1 row-end-3 ">
                <CardHeader>
                  <CardTitle className="flex flex-col w-full items-start gap-2 text-lg">
                    <Input
                      disabled={Object.keys(activeTask).length === 0}
                      className="border-none focus-visible:ring-0 text-lg"
                      onChange={handleTitleChange}
                      value={activeTask.text || ""}
                    />
                    <ButtonGroup />
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto">
                  <Textarea
                    ref={textAreaRef}
                    disabled={Object.keys(activeTask).length === 0}
                    className="resize-none min-h-[100px] w-full border-none focus-visible:ring-0 shadow-none"
                    onChange={handleDescriptionChange}
                    value={activeTask.description || ""}
                  />
                  {error && (
                    <div className="text-red-500 text-sm mb-2">{error}</div>
                  )}

                  <TaskChecklist
                    setTasks={setTasks}
                    activeTask={activeTask}
                    setActiveTaskId={setActiveTaskId}
                  />

                  <CardFooter className="absolute bottom-4 right-4 flex flex-row gap-4  mt-2">
                    <Button
                      variant={"outline"}
                      onClick={handleAIGenerate}
                      disabled={
                        isGenerating || Object.keys(activeTask).length === 0
                      }
                    >
                      {isGenerating ? "Generating..." : "Customize with AI"}
                    </Button>
                    <Button type="submit">Save changes</Button>
                  </CardFooter>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="days">Change your password here.</TabsContent>
          </Tabs>
        </main>
      </div>

  );
}
