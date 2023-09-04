"use client";

import * as React from "react";
import { StatusCard } from "@/components/status";
import { type Status } from "@/lib/types/status";
import { type Profile } from "@/lib/types/profile";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileCard } from "@/components/profile";

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
    queryKey: ["statuses", "search", q],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/statuses?q=${q}&page=${pageParam}`);
      return res.json();
    },
    getNextPageParam: (lastPage: any, pages: any) =>
      lastPage.data.has_more ? pages.length : undefined,
    enabled: q !== "",
  });

  const {
    data: profilesData,
    fetchNextPage: profilesFetchNextPage,
    hasNextPage: profilesHasNextPage,
    isFetching: profilesIsFetching,
    isFetchingNextPage: profilesIsFetchingNextPage,
    status: profilesStatus,
  } = useInfiniteQuery({
    queryKey: ["profiles", "search", q],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/profiles?q=${q}&page=${pageParam}`);
      return res.json();
    },
    getNextPageParam: (lastPage: any, pages: any) =>
      lastPage.data.has_more ? pages.length : undefined,
    enabled: q !== "",
  });

  console.log(profilesData);

  return (
    <div className="container">
      <Tabs defaultValue="statuses" className="">
        <TabsList className="w-1/2 translate-x-1/2">
          <TabsTrigger value="statuses" className="w-1/2">
            Estados
          </TabsTrigger>
          <TabsTrigger value="profiles" className="w-1/2">
            Usuarios
          </TabsTrigger>
        </TabsList>
        <TabsContent value="statuses">
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
              <div>
                {isFetching && !isFetchingNextPage ? "Fetching..." : null}
              </div>
            </>
          )}
        </TabsContent>
        <TabsContent value="profiles">
          {profilesStatus === "loading" ? (
            <p>Loading...</p>
          ) : profilesStatus === "error" ? (
            <p>Error</p>
          ) : (
            <>
              {profilesData.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.data.profiles.map((profile: Profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </React.Fragment>
              ))}
              <div>
                <button
                  onClick={() => profilesFetchNextPage()}
                  disabled={!profilesHasNextPage || profilesIsFetchingNextPage}
                >
                  {profilesIsFetchingNextPage
                    ? "Loading more..."
                    : profilesHasNextPage
                    ? "Load More"
                    : "Nothing more to load"}
                </button>
              </div>
              <div>
                {profilesIsFetching && !profilesIsFetchingNextPage
                  ? "Fetching..."
                  : null}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchPage;
