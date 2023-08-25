import { SelectedPick } from "@xata.io/client";

import { StatusRecord } from "@/lib/xata";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusDynamicBody } from "../../status-dynamic-body";
import { QuoteStatusForm } from "./form";

const QuoteDialog = ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>;
}) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Cita</DialogTitle>
        <DialogDescription>Publica algo citando este estado</DialogDescription>
      </DialogHeader>
      <QuoteStatusForm status_id={status.id}>
        <StatusDynamicBody className="ml-4 mt-4 border-l py-2 pl-4 text-sm text-muted-foreground">
          {status.body}
        </StatusDynamicBody>
      </QuoteStatusForm>
    </DialogContent>
  );
};

export { QuoteDialog };
