import { Skeleton } from "@/components/ui/skeleton";

const LoadingPage = () => {
  return (
    <div className="container pt-6">
      <div className="flex gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="grid grid-cols-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-96 my-1" />
      <Skeleton className="h-4 w-64 my-1.5" />
    </div>
  );
};

export default LoadingPage;
