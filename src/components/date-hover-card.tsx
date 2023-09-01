import { CalendarDays } from "lucide-react";

import { cn } from "@/utils/cn";
import { getRelativeTimeString } from "@/utils/get-relative-time-string";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";

export function DateHoverCard({
  date,
  className,
  status_id,
}: {
  date: Date;
  className?: string | null;
  status_id: string;
}) {
  if (date.toString() === "Invalid Date" || !date || !status_id) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/app/status/${status_id.replace("rec_", "")}`}
          className={cn("font-light text-muted-foreground", className)}
        >
          {getRelativeTimeString(date)}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-max px-1 py-0.5">
        <div className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span className="text-xs">
            {date.toLocaleString("es-ES", {
              dateStyle: "short",
              timeStyle: "short",
              timeZone: "America/Lima",
            })}
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
