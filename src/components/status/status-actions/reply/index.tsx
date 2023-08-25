import { SelectedPick } from "@xata.io/client";

import { StatusRecord } from "@/lib/xata";
import { Dialog } from "@/components/ui/dialog";
import { ReplyDialog } from "./dialog";
import { ReplyTrigger } from "./trigger";

const ReplyAction = ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>;
}) => {
  return (
    <Dialog>
      <ReplyTrigger />
      <ReplyDialog status={status} />
    </Dialog>
  );
};

export { ReplyAction };
