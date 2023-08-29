"use client";
import { Heart } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { LikeStatusAction } from "@/app/actions/like-status";
import { cn } from "@/utils/cn";

interface Props {
  status_id: string;
  like_count: number;
  is_liked: boolean;
}

interface LikeState {
  is_liked: boolean;
  like_count: number;
}

const LikeAction = ({ status_id, like_count, is_liked }: Props) => {
  let [sending, setSending] = React.useState(false);
  let [likeState, setLikeState] = React.useState<LikeState>({
    is_liked,
    like_count,
  });

  return (
    <Button
      variant="ghost"
      className={cn("text-muted-foreground", {
        "text-red-600": likeState.is_liked,
      })}
      onClick={async () => {
        if (!sending) {
          setSending(true);
          setLikeState((likeState) => ({
            is_liked: !likeState.is_liked,
            like_count: likeState.like_count + (!likeState.is_liked ? 1 : -1),
          }));
          let response = await LikeStatusAction(status_id);
          if (response.status === "success") {
            setLikeState({
              is_liked: response.data.is_liked,
              like_count: response.data.like_count,
            });
          }

          setSending(false);
        }
      }}
    >
      <Heart className="mr-2 h-4 w-4" /> {likeState.like_count}
    </Button>
  );
};

export { LikeAction };
