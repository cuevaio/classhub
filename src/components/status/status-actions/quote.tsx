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

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { QuoteStatusAction } from "@/app/actions/quote-status";
import { Repeat2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

const Quote = ({
  children,
  status_id,
  initial_is_quoted,
  initial_quote_count,
}: {
  children: React.ReactNode;
  status_id: string;
  initial_is_quoted: boolean;
  initial_quote_count: number;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  let [open, setOpen] = React.useState(false);
  let [is_quoted, setIsQuoted] = React.useState(initial_is_quoted);
  let [quote_count, setQuoteCount] = React.useState(initial_quote_count);
  let [sending, setSending] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn("text-muted-foreground", {
            "text-sky-500": is_quoted,
          })}
        >
          <Repeat2 className="mr-2 h-4 w-4" />
          {quote_count}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cita</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!sending) {
              setSending(true);
              let data = new FormData(event.currentTarget);
              data.append("parent_status", status_id);

              let response = await QuoteStatusAction(data);

              if (response.status === "success") {
                let quote_id = response.data.quote_id;
                setQuoteCount(response.data.quote_count);
                setIsQuoted(true);

                toast({
                  description: "Tu cita ha sido publicada",
                  action: (
                    <ToastAction
                      altText="Ver la cita creada"
                      onClick={() =>
                        router.push(
                          `/app/status/${quote_id.replace("rec_", "")}`
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

export { Quote };
