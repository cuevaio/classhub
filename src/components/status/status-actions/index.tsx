"use client";

import { SelectedPick } from "@xata.io/client";
import { StatusRecord } from "@/lib/xata";
import { LikeAction } from "./like-button";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Repeat2 } from "lucide-react";

import { Reply } from "./reply";
import { StatusBody } from "../status-body";
import { Quote } from "./quote";
import { useQuery } from "@tanstack/react-query";

interface StatusActionsProps {
  id: string;
  like_count: number;
  reply_count: number;
  quote_count: number;
  body: string;
}

const StatusActions = ({id,like_count,reply_count,quote_count,body}: StatusActionsProps) => {
  async function fetchStats() {
    const res = await fetch(`/api/statuses/${id}/stats`);
    return res.json();
  }

  const { data: stats } = useQuery({
    queryKey: ["stats", id],
    queryFn: fetchStats,
  });

  if (stats) {
    return (
      <div className="flex gap-4">
        <Reply
          status_id={id}
          initial_is_replied={stats.is_replied}
          initial_reply_count={reply_count}
        >
          <StatusBody
            status_id={id}
            className="ml-4 mt-4 border-l py-2 pl-4 text-sm text-muted-foreground"
          >
            {body}
          </StatusBody>
        </Reply>

        <Quote
          status_id={id}
          initial_is_quoted={stats.is_quoted}
          initial_quote_count={quote_count}
        >
          <StatusBody
            status_id={id}
            className="ml-4 mt-4 border-l py-2 pl-4 text-sm text-muted-foreground"
          >
            {body}
          </StatusBody>
        </Quote>
        <LikeAction
          status_id={id}
          like_count={like_count}
          is_liked={stats.is_liked}
        />
      </div>
    );
  } else {
    return (
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
  }
};

export { StatusActions };
