import { Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

const QuoteTrigger = () => {
  return (
    <DialogTrigger asChild>
      <Button variant="ghost" className="text-muted-foreground">
        <Quote className="mr-2 h-4 w-4" /> Quote
      </Button>
    </DialogTrigger>
  );
};

export { QuoteTrigger };
