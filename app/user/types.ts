import type { user } from "@/user/schema"
import type { InferSelectModel } from "drizzle-orm"

export type User = InferSelectModel<typeof user>
