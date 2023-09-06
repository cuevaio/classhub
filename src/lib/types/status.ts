import { SelectedPick } from "@xata.io/client";

import { type StatusRecord } from "@/lib/xata";

export type ReplyWithParent = SelectedPick<
  StatusRecord,
  // @ts-ignore
  [
    "id",
    "body",
    "like_count",
    "quote_count",
    "reply_count",
    "xata.createdAt",

    "reply_to.id",
    "reply_to.body",
    "reply_to.like_count",
    "reply_to.quote_count",
    "reply_to.reply_count",
    "reply_to.xata.createdAt",

    "reply_to.author_profile.handle",
    "reply_to.author_profile.name",
    "reply_to.author_profile.profile_picture",
    "reply_to.author_profile.bio",

    "reply_to.quote_from.id",
    "reply_to.quote_from.body",
    "reply_to.quote_from.like_count",
    "reply_to.quote_from.quote_count",
    "reply_to.quote_from.reply_count",
    "reply_to.quote_from.xata.createdAt",

    // @ts-ignore
    "reply_to.quote_from.author_profile.handle",
    // @ts-ignore
    "reply_to.quote_from.author_profile.name",
    // @ts-ignore
    "reply_to.quote_from.author_profile.profile_picture",
    // @ts-ignore
    "reply_to.quote_from.author_profile.bio"
  ]
>;

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
