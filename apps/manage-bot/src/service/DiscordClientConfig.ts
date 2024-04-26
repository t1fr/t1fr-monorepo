import { z } from "zod";

export const DiscordClientConfig = z.object({
    channels: z.object({
        recruitment: z.object({
            apply: z.string(),
            notice: z.string(),
        }),
        sqb: z.object({
            category: z.string(),
            battlerating: z.string(),
            announcement: z.string(),
        }),
    }),
    guilds: z.object({
        t1fr: z.string(),
    }),
    roles: z.object({
        officer: z.string(),
        fighter: z.string(),
        relaxer: z.string(),
        notification: z.object({
            sqb: z.string(),
        }),
    }),
});


export type DiscordClientConfig = z.infer<typeof DiscordClientConfig>