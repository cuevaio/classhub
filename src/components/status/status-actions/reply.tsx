"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ReplyStatusAction } from "@/app/actions/reply-status";
import { ToastAction } from "@/components/ui/toast";
import { cn } from "@/utils/cn";

const Reply = ({
  children,
  status_id,
  initial_is_replied,
  initial_reply_count,
}: {
  children: React.ReactNode;
  status_id: string;
  initial_is_replied: boolean;
  initial_reply_count: number;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  let [open, setOpen] = React.useState(false);
  let [is_replied, setIsReplied] = React.useState(initial_is_replied);
  let [reply_count, setReplyCount] = React.useState(initial_reply_count);
  let [sending, setSending] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn("text-muted-foreground", {
            "text-green-500": is_replied,
          })}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          {reply_count}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Respuesta</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!sending) {
              setSending(true);
              let data = new FormData(event.currentTarget);
              data.append("parent_status", status_id);

              let response = await ReplyStatusAction(data);

              if (response.status === "success") {
                let reply_id = response.data.reply_id;
                setReplyCount(response.data.reply_count);
                setIsReplied(true);

                toast({
                  description: "Tu respuesta ha sido publicada",
                  action: (
                    <ToastAction
                      altText="Ver la respuesta creada"
                      onClick={() =>
                        router.push(
                          `/app/status/${reply_id.replace(
                            "rec_",
                            ""
                          )}`
                        )
                      }
                    >
                      Ver
                    </ToastAction>
                  ),
                });
              }

              setSending(false);
              setOpen(false);
            }
          }}
        >
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="¿En qué estás pensando?"
              name="body"
              className="col-span-3"
            />
          </div>
          {children}
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={sending}>
              Publicar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { Reply };
