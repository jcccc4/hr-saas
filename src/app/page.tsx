import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "lucide-react";

export default function Home() {
  return (
    <div>
      <header className="bg-white p-4">
        <div className=" flex gap-2 e">
          <Button className="bg-white" variant="outline" size="icon">
            <Menu />
          </Button>
          <h1 className="text-2xl font-semibold">To do List</h1>
        </div>

        <div></div>
      </header>
      <main>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full flex justify-start bg-white rounded-none">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
