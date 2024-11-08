import { Button } from "@/components/ui/button";
import { Calendar, Flag, Tag } from "lucide-react";
import React from "react";

function ButtonGroup() {
  return (
    <div className="flex gap-2">
      <Button size="icon-sm" variant="outline">
        <Calendar />
      </Button>
      <Button size="icon-sm" variant="outline">
        <Flag />
      </Button>
      <Button size="icon-sm" variant="outline">
        <Tag />
      </Button>
    </div>
  );
}

export default ButtonGroup;
