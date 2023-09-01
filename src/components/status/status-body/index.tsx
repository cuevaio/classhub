"use client";
import * as React from "react";

import { cn } from "@/utils/cn";

import Link from "next/link";
import { HoverCard } from "./hover-card";

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  status_id: string;
}

const StatusBody = ({ status_id, className, children, ...props }: Props) => {
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

  let react_nodes: Array<React.ReactNode> = [];

  let string_to_check: string = children;

  while (true) {
    let [static_string, ...rest] = string_to_check.split("@");
    react_nodes.push(<Link href={status_href}>{static_string}</Link>);

    string_to_check = string_to_check.replace(static_string, "");

    let handle_to_test_index = 0;

    let replaced = false;

    while (true) {
      if (handle_to_test_index === matches.length) break;

      if (string_to_check.startsWith("@" + matches[handle_to_test_index])) {
        react_nodes.push(<HoverCard handle={matches[handle_to_test_index]} />);
        string_to_check = string_to_check.replace(
          "@" + matches[handle_to_test_index],
          ""
        );
        replaced = true;

        break;
      } else {
        handle_to_test_index++;
      }
    }

    if (replaced === false) {
      react_nodes.push(
        <Link key={handle_to_test_index} href={status_href}>
          {string_to_check}
        </Link>
      );
      break;
    }
  }

  return (
    <p className={cn(className)} {...props}>
      {react_nodes}
    </p>
  );
};

export { StatusBody };
