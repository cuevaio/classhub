import { Reply } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

const ReplyTrigger = () => {
  return (
    <DialogTrigger asChild>
      <Button variant="ghost" className="text-muted-foreground">
        <Reply className="mr-2 h-4 w-4" /> Reply
      </Button>
    </DialogTrigger>
  );
};

export { ReplyTrigger };
