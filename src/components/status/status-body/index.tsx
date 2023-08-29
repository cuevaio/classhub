import * as React from "react";

import { cn } from "@/utils/cn";
import { StatusDynamicBody } from "./dynamic";

const StatusBody = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <React.Suspense
    fallback={
      <p className={cn(className)} {...props}>
        <span>{children}</span>
      </p>
    }
  >
    <StatusDynamicBody className={cn(className)} {...props}>
      {children}
    </StatusDynamicBody>
  </React.Suspense>
);

export { StatusBody };
