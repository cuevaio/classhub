"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as React from "react";
import { StatusCard } from "@/components/status";

import { type StatusWithQuote } from "@/lib/types/status";
import { StatusSkeleton } from "@/components/status/skeleton";
import { Button } from "@/components/ui/button";

const AppPage = () => {
  const fetchProjects = async ({ pageParam = 0 }) => {
    const res = await fetch("/api/statuses?page=" + pageParam);
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    getNextPageParam: (lastPage: any, pages: any) =>
      lastPage.data.has_more ? pages.length : undefined,
  });

  return (
    <div className="container">
      {status === "loading" ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <StatusSkeleton key={i} />
          ))}
        </div>
      ) : status === "error" ? (
        <p>Error</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.statuses.map((status: StatusWithQuote) => (
                <StatusCard key={status.id} status={status} />
              ))}
            </React.Fragment>
          ))}
          <div className="flex justify-center">
            <Button
              variant="secondary"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Cargando..."
                : hasNextPage
                ? "Ver más"
                : "Ups, fin."}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppPage;
