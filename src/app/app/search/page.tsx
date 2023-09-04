"use client";

import * as React from "react";
import { StatusCard } from "@/components/status";
import { type Status } from "@/lib/types/status";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  let searchParams = useSearchParams();
  let q = searchParams.get("q") || "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["search", q],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/statuses?q=${q}&page=${pageParam}`);
      return res.json();
    },
    getNextPageParam: (lastPage: any, pages: any) =>
      lastPage.data.has_more ? pages.length : undefined,
    enabled: q !== "",
  });

  return (
    <div className="container">
      {status === "loading" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <p>Error</p>
      ) : (
        <>
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.statuses.map((status: Status) => (
                <StatusCard key={status.id} status={status} />
              ))}
            </React.Fragment>
          ))}
          <div>
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </button>
          </div>
          <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
