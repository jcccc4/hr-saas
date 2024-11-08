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
import { Menu } from "lucide-react";
import { useState } from "react";
export type Task = {
  id: number;
  text: string;
  description: string;
  completed: boolean;
};

import TaskDetail from "./_component/TaskDetail";
import ButtonGroup from "./_component/ButtonGroup";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Buy groceries", description: "try", completed: false },
    {
      id: 2,
      text: "Finish work presentation",
      description: "test",
      completed: false,
    },
    {
      id: 3,
      text: "Go for a 30-minute walk",
      description: "",
      completed: true,
    },
    {
      id: 4,
      text: "Read a chapter of my book",
      description: "",
      completed: false,
    },
    { id: 5, text: "Call mom", description: "", completed: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white px-4 pt-4 pb-2">
        <div className=" flex gap-2">
          <Button className="bg-white" variant="outline" size="icon">
            <Menu />
          </Button>
          <h1 className="text-2xl font-semibold">To do List</h1>
        </div>
      </header>
      <main className="bg-[#D2DDEF] flex-grow">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full flex justify-start bg-white rounded-non px-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="days">Next 7 days</TabsTrigger>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
          </TabsList>
          <TabsContent
            value="today"
            className="flex flex-col items-center px-4 gap-2"
          >
            <Card className="p-4 w-full flex flex-col gap-2">
              <CardContent>
                <Input
                  type="task"
                  className="w-full"
                  placeholder="What would you like to do?"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <ButtonGroup />
                <Button>Add Task</Button>
              </CardFooter>
            </Card>
            <Card className="p-4 w-full flex flex-col ">
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tasks.map((task) => (
                    <TaskDetail
                      key={task.id}
                      task={task}
                      toggleTask={toggleTask}
                      removeTask={removeTask}
                    />
                  ))}
                </ul>
                {tasks.length === 0 && (
                  <p className="text-center text-muted-foreground mt-4">
                    No tasks yet. Add some tasks to get started!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="days">Change your password here.</TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
