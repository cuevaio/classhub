import { SelectedPick } from "@xata.io/client";

import { StatusRecord } from "@/lib/xata";
import { Dialog } from "@/components/ui/dialog";
import { QuoteDialog } from "./dialog";
import { QuoteTrigger } from "./trigger";

const QuoteAction = ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>;
}) => {
  return (
    <Dialog>
      <QuoteTrigger />
      <QuoteDialog status={status} />
    </Dialog>
  );
};

export { QuoteAction };
