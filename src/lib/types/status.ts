import { SelectedPick } from "@xata.io/client";

import { type StatusRecord } from "@/lib/xata";

export type StatusWithQuote = SelectedPick<
  StatusRecord,
  [
    "id",
    "body",
    "like_count",
    "quote_count",
    "reply_count",
    "xata.createdAt",

    "author_profile.handle",
    "author_profile.name",
    "author_profile.profile_picture",
    "author_profile.bio",
    "author_profile.email",
    "author_profile.like_count",
    "author_profile.follower_count",
    "author_profile.following_count",
    "author_profile.school.handle",

    "quote_from.id",
    "quote_from.body",
    "quote_from.like_count",
    "quote_from.quote_count",
    "quote_from.reply_count",
    "quote_from.xata.createdAt",

    "quote_from.author_profile.handle",
    "quote_from.author_profile.name",
    "quote_from.author_profile.profile_picture",
    "quote_from.author_profile.bio"
  ]
>;

export type QuoteStatus = SelectedPick<
  StatusRecord,
  [
    "id",
    "body",
    "like_count",
    "quote_count",
    "reply_count",
    "xata.createdAt",

    "author_profile.handle",
    "author_profile.name",
    "author_profile.profile_picture",
    "author_profile.bio"
  ]
>;
