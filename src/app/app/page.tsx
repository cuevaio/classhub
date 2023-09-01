"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as React from "react";
import { StatusCard } from "@/components/status";

import { SelectedPick } from "@xata.io/client";

import { type ProfileRecord, StatusRecord } from "@/lib/xata";

type Status = SelectedPick<
  StatusRecord,
  [
    "*",
    "author_profile.*",
    "quote_from.*",
    "quote_from.author_profile.*",
    "xata.createdAt"
  ]
>;

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

  return status === "loading" ? (
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
  );
};

export default AppPage;
