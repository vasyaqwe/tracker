import { publicEnv } from "@/env"
import { GitHub, Google } from "arctic"
import { getEvent } from "vinxi/http"

export const githubClient = () => {
   const env = getEvent().context.cloudflare.env
   return new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, {})
}

export const googleClient = () => {
   const env = getEvent().context.cloudflare.env
   return new Google(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      `${publicEnv.VITE_BASE_URL}/api/auth/callback/google`,
   )
}
