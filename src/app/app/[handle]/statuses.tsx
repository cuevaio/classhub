"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as React from "react";
import { StatusCard } from "@/components/status";

import { type ReplyWithParent, type StatusWithQuote } from "@/lib/types/status";
import { StatusSkeleton } from "@/components/status/skeleton";
import { Button } from "@/components/ui/button";
import { type Profile } from "@/lib/types/profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const {
    data: repliesData,
    fetchNextPage: repliesFetchNextPage,
    hasNextPage: repliesHasNextPage,
    isFetchingNextPage: repliesIsFetchingNextPage,
    status: repliesStatus,
  } = useInfiniteQuery({
    queryKey: ["replies", "profile", handle],
    queryFn: async ({ pageParam = 0 }) => {
      let res = await fetch(
        `/api/profiles/${handle}/replies?page=${pageParam}`
      );
      return res.json();
    },
    getNextPageParam: (lastPage: any, pages: any) =>
      lastPage.data.has_more ? pages.length : undefined,
  });

  return (
    <Tabs defaultValue="statuses" className="">
      <TabsList className="w-full h-12">
        <TabsTrigger value="statuses" className="w-1/2 h-full">
          Estados
        </TabsTrigger>
        <TabsTrigger value="replies" className="w-1/2 h-full">
          Respuestas
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
                  ? "Cargando..."
                  : hasNextPage
                  ? "Ver más"
                  : "Ups, fin."}
              </Button>
            </div>
          </div>
        )}
      </TabsContent>
      <TabsContent value="replies">
        {repliesStatus === "loading" ? (
          <p>Loading...</p>
        ) : repliesStatus === "error" ? (
          <p>Error</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {repliesData.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.data.replies.map((reply: ReplyWithParent) => (
                  <div className="space-y-2" key={reply.id}>
                    <StatusCard status={reply.reply_to as StatusWithQuote} />
                    <div className="flex">
                      <div
                        className="relative w-12 border-b border-l rounded-bl-lg -z-10
                        translate-x-1/2 -translate-y-1/2"
                      >
                        <div className="absolute bg-background -top-1/2 right-0 -left-1/2  bottom-1/2 -translate-y-2"></div>
                        <div className="absolute bg-background  top-1/2 right-0  left-1/2 -bottom-1/2"></div>
                      </div>
                      <StatusCard
                        key={reply.id}
                        // @ts-ignore
                        status={{
                          ...reply,
                          author_profile: profile,
                        }}
                        className="grow"
                      />
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={() => repliesFetchNextPage()}
                disabled={!repliesHasNextPage || repliesIsFetchingNextPage}
              >
                {repliesIsFetchingNextPage
                  ? "Cargando..."
                  : repliesHasNextPage
                  ? "Ver más"
                  : "Ups, fin."}
              </Button>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export { ProfileStatuses };
