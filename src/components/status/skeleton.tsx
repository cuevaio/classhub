import { Skeleton } from "../ui/skeleton";

const StatusSkeleton = () => (
  <div className="p-2 border bg-muted/20 space-y-2 rounded-lg">
    <div className="flex space-x-4">
      <Skeleton className="h-14 w-14 rounded-full flex-none" />
      <div className="space-y-1 grow">
        <Skeleton className="h-4 w-1/2 sm:w-64" />
        <Skeleton className="h-4 w-2/3 sm:w-96" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2 w-[14rem]">
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
    </div>
  </div>
);

export { StatusSkeleton };
