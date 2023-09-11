import { People } from "./profiles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const FollowersPage = ({ params }: { params: { handle: string } }) => {
  let { handle } = params;
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Button asChild variant="outline" size="icon">
          <Link href={`/app/${handle}`}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="font-bold text-lg">Seguidores de @{handle}</h1>
      </div>
      <People handle={handle} />
    </div>
  );
};

export default FollowersPage;
