import type { OAUTH_PROVIDERS } from "@/auth/constants"
import type { session } from "@/auth/schema"
import type { InferSelectModel } from "drizzle-orm"

export type OauthProvider = (typeof OAUTH_PROVIDERS)[number]
export type Session = InferSelectModel<typeof session>
