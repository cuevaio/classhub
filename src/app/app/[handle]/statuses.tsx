"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as React from "react";
import { StatusCard } from "@/components/status";

import { type StatusWithQuote } from "@/lib/types/status";
import { StatusSkeleton } from "@/components/status/skeleton";
import { Button } from "@/components/ui/button";
import { type Profile } from "@/lib/types/profile";

const ProfileStatuses = ({
  handle,
  profile,
}: {
  handle: string;
  profile: Profile;
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["statuses", "profile", handle],
      queryFn: async ({ pageParam = 0 }) => {
        let res = await fetch(
          `/api/profiles/${handle}/statuses?page=${pageParam}`
        );
        return res.json();
      },
      getNextPageParam: (lastPage: any, pages: any) =>
        lastPage.data.has_more ? pages.length : undefined,
    });

  console.log(data);

  return (
    <React.Fragment>
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
                <StatusCard
                  key={status.id}
                  status={{ ...status, author_profile: profile }}
                />
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
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </Button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export { ProfileStatuses };
