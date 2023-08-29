import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Repeat2 } from "lucide-react";

import { SelectedPick } from "@xata.io/client";
import { StatusRecord } from "@/lib/xata";

export const StatusActionsFallback = ({
  like_count,
  reply_count,
  quote_count,
  save_count,
}: SelectedPick<
  StatusRecord,
  ["like_count", "reply_count", "quote_count", "save_count"]
>) => (
  <div className="flex gap-4">
    <Button variant="ghost" className="text-muted-foreground">
      <MessageSquare className="mr-2 h-4 w-4" /> {reply_count}
    </Button>
    <Button variant="ghost" className="text-muted-foreground">
      <Repeat2 className="mr-2 h-4 w-4" /> {quote_count}
    </Button>
    <Button variant="ghost" className="text-muted-foreground">
      <Heart className="mr-2 h-4 w-4" /> {like_count}
    </Button>
  </div>
);
