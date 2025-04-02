import type { errorCodeSchema } from "@/error/schema"
import type { z } from "zod"

export type ErrorCode = z.infer<typeof errorCodeSchema>
