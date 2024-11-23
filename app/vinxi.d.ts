import type { CloudflareEnv } from "@/lib/cloudflare"
import type { PlatformProxy } from "wrangler"

declare module "vinxi/http" {
   interface H3EventContext {
      cloudflare: PlatformProxy<CloudflareEnv>
   }
}
