import * as React from "react";

import { cn } from "@/utils/cn";
import { StatusDynamicBody } from "./dynamic";
import Link from "next/link";

interface StatusBodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  status_id: string;
}

const StatusBody = ({
  className,
  children,
  status_id,
  ...props
}: StatusBodyProps) => {
  let status_href = `/app/status/${status_id.replace("rec_", "")}`;
  
  return (
    <React.Suspense
      fallback={
        <p className={cn(className)} {...props}>
          <Link href={status_href}>{children}</Link>
        </p>
      }
    >
      <StatusDynamicBody className={className} status_id={status_id} {...props}>
        {children}
      </StatusDynamicBody>
    </React.Suspense>
  );
};

export { StatusBody };
