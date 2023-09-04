"use client";
import { useDebounce } from "@/utils/hooks/use-debounce";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Input } from "../ui/input";

const Search = () => {
  let router = useRouter();

  const [debouncedQuery, query, setQuery] = useDebounce<string>("", 300);

  React.useEffect(() => {
    if (debouncedQuery !== "") {
      router.push(`/app/search?q=${debouncedQuery}`);
    }
  }, [debouncedQuery]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (query !== "") {
          router.push(`/app/search?q=${query}`);
        }
      }}
    >
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

export { Search };
