"use client";
import { Heart } from "lucide-react";
import { experimental_useOptimistic as useOptimistic } from "react";

import { Button } from "@/components/ui/button";
import { likeStatus } from "@/lib/mutations/like-status";
import { cn } from "@/utils/cn";

interface Props {
  status_id: string;
  like_count: number;
  is_liked: boolean;
}

interface OptimisticUpdate {
  is_liked: boolean;
  like_count: number;
  sending: boolean;
}

const LikeAction = ({ status_id, like_count, is_liked }: Props) => {
  const [optimisticState, updateOptimisticState] = useOptimistic<
    OptimisticUpdate,
    boolean
  >({ is_liked, like_count, sending: false }, (state, liked) => ({
    is_liked: liked,
    like_count: state.like_count + (liked ? 1 : -1),
    sending: true,
  }));

  return (
    <Button
      variant="ghost"
      className={cn("text-muted-foreground", {
        "text-red-600": optimisticState.is_liked,
      })}
      onClick={async () => {
        if (!optimisticState.sending) {
          updateOptimisticState(!optimisticState);
          await likeStatus(status_id);
        }
      }}
    >
      <Heart className="mr-2 h-4 w-4" /> {like_count}
    </Button>
  );
};

export { LikeAction };
