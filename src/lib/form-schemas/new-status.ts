import { z } from "zod";

let NewStatusSchema = z.object({
  body: z.string().min(1).max(280),
  author_option: z.enum(["user", "anonymous"]),
  audience_option: z.enum(["everyone", "school", "circle"]),
});

export type NewStatusType = z.infer<typeof NewStatusSchema>;

export { NewStatusSchema };
