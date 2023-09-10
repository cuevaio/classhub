"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as React from "react";
import { StatusCard } from "@/components/status";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type StatusWithQuote } from "@/lib/types/status";
import { StatusSkeleton } from "@/components/status/skeleton";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/utils/hooks/use-current-user";

const AppPage = () => {
  const fetchHomeStatuses = async ({ pageParam = 0 }) => {
    const res = await fetch("/api/statuses?page=" + pageParam);
    return res.json();
  };

  const fetchSchoolStatuses = async ({ pageParam = 0 }) => {
    const res = await fetch("/api/statuses?school=true&page=" + pageParam);
    return res.json();
  };

  let {profile} = useCurrentUser();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["statuses", "home"],
    queryFn: fetchHomeStatuses,
    getNextPageParam: (lastPage: any, pages: any) =>
      lastPage.data.has_more ? pages.length : undefined,
  });

  const {
    data: schoolData,
    fetchNextPage: schoolFetchNextPage,
    hasNextPage: schoolHasNextPage,
    isFetchingNextPage: schoolIsFetchingNextPage,
    status: schoolStatus,
  } = useInfiniteQuery({
    queryKey: ["statuses", "school"],
    queryFn: fetchSchoolStatuses,
    getNextPageParam: (lastPage: any, pages: any) =>
      lastPage.data.has_more ? pages.length : undefined,
  });

  return (
    <div className="container">
      <Tabs defaultValue="home" className="">
        <TabsList className="w-full h-12">
          <TabsTrigger value="home" className="w-1/2 h-full">
            Inicio
          </TabsTrigger>
          <TabsTrigger value="school" className="w-1/2 h-full">
            {profile?.school?.handle?.toUpperCase() || "Campus"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home">
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
        <TabsContent value="school">
          {schoolStatus === "loading" ? (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(3)].map((_, i) => (
                <StatusSkeleton key={i} />
              ))}
            </div>
          ) : schoolStatus === "error" ? (
            <p>Error</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {schoolData.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.data.statuses.map((status: StatusWithQuote) => (
                    <StatusCard key={status.id} status={status} />
                  ))}
                </React.Fragment>
              ))}
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => schoolFetchNextPage()}
                  disabled={!schoolHasNextPage || schoolIsFetchingNextPage}
                >
                  {schoolIsFetchingNextPage
                    ? "Cargando..."
                    : schoolHasNextPage
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

export default AppPage;
