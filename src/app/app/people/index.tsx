"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/profile";
import { type Profile } from "@/lib/types/profile";


const People = () => {
  const fetchPeople = async ({ pageParam = 0 }) => {
    const res = await fetch("/api/profiles?page=" + pageParam);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["profiles"],
      queryFn: fetchPeople,
      getNextPageParam: (lastPage: any, pages: any) =>
        lastPage.data.has_more ? pages.length : undefined,
    });

  return (
    <div className="flex-none border rounded-lg p-4 w-72 md:w-80 h-min hidden sm:block">
      <h1 className="font-bold mb-4">Gente que quizás conozcas</h1>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <p>Error</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.profiles.map((profile: Profile) => (
                <ProfileCard key={profile.id} profile={profile} />
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

export {People};
