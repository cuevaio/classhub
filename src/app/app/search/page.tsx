"use client";

import * as React from "react";
import { StatusCard } from "@/components/status";
import { type StatusWithQuote } from "@/lib/types/status";
import { type Profile } from "@/lib/types/profile";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileCard } from "@/components/profile";
import { StatusSkeleton } from "@/components/status/skeleton";
import { Button } from "@/components/ui/button";

const SearchPage = () => {
  let searchParams = useSearchParams();
  let q = searchParams.get("q") || "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
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
        </TabsContent>
        <TabsContent value="profiles">
          {profilesStatus === "loading" ? (
            <p>Loading...</p>
          ) : profilesStatus === "error" ? (
            <p>Error</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {profilesData.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.data.profiles.map((profile: Profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </React.Fragment>
              ))}
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => profilesFetchNextPage()}
                  disabled={!profilesHasNextPage || profilesIsFetchingNextPage}
                >
                  {profilesIsFetchingNextPage
                    ? "Cargando..."
                    : profilesHasNextPage
                    ? "Ver más"
                    : "Ups, fin."}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchPage;
