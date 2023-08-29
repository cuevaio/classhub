"use server";
import * as React from "react";

import { cn } from "@/utils/cn";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";

import { type ProfileRecord, getXataClient } from "@/lib/xata";
import Link from "next/link";
let xata = getXataClient();

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  status_id: string;
}

const StatusDynamicBody = async ({
  status_id,
  className,
  children,
  ...props
}:Props ) => {
  let status_href = `/app/status/${status_id.replace("rec_", "")}`;
  if (typeof children !== "string") return;

  const pattern = /@(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])/g;
  const matches = Array.from(children.match(pattern) || []).map((el) =>
    el.replace("@", "")
  );

  if (!matches || matches.length === 0)
    return (
      <p className={cn(className)} {...props}>
        <Link href={status_href}>{children}</Link>
      </p>
    );

  const profiles = (await xata.db.profile
    .filter({
      handle: { $any: matches },
    })
    .getAll()) as ProfileRecord[];

  const existing_profiles = profiles.map((p) => p.handle as string);

  if (existing_profiles.length === 0)
    return (
      <p className={cn(className)} {...props}>
        <Link href={status_href}>{children}</Link>
      </p>
    );

  let react_nodes: Array<React.ReactNode> = [];

  let string_to_check: string = children;

  while (true) {
    let [static_string, ...rest] = string_to_check.split("@");
    react_nodes.push(<Link href={status_href}>{static_string}</Link>);

    string_to_check = string_to_check.replace(static_string, "");

    let handle_to_test_index = 0;

    let replaced = false;
    while (true) {
      if (handle_to_test_index === existing_profiles.length) break;

      if (
        string_to_check.startsWith(
          "@" + existing_profiles[handle_to_test_index]
        )
      ) {
        react_nodes.push(
          <ProfileHoverCard profile={profiles[handle_to_test_index]} className="text-primary font-medium">
            @{existing_profiles[handle_to_test_index]}
          </ProfileHoverCard>
        );
        string_to_check = string_to_check.replace(
          "@" + existing_profiles[handle_to_test_index],
          ""
        );
        replaced = true;

        break;
      } else {
        handle_to_test_index++;
      }
    }

    if (replaced === false) {
      react_nodes.push(<Link href={status_href}>{string_to_check}</Link>);
      break;
    }
  }

  return (
    <p className={cn(className)} {...props}>
      {react_nodes}
    </p>
  );
};


export { StatusDynamicBody };
