import { githubClient, googleClient } from "@/auth"
import {
   deleteSessionTokenCookie,
   getSessionTokenCookie,
   invalidateAuthSession,
} from "@/auth/utils"
import { COOKIE_OPTIONS } from "@/cookie/constants"
import { createServerFn } from "@tanstack/start"
import { generateCodeVerifier, generateState } from "arctic"
import { match } from "ts-pattern"
import { setCookie, setHeader } from "vinxi/http"

export const githubLogin = createServerFn({ method: "POST" }).handler(
   async () => {
      const state = generateState()
      const url = await githubClient().createAuthorizationURL(state, {
         scopes: ["user:email"],
      })

      setCookie("github_oauth_state", state, COOKIE_OPTIONS)

      setHeader("Location", url.toString())

      return url.toString()
   },
)

export const googleLogin = createServerFn({ method: "POST" }).handler(
   async () => {
      const state = generateState()
      const codeVerifier = generateCodeVerifier()
      const url = await googleClient().createAuthorizationURL(
         state,
         codeVerifier,
         {
            scopes: ["profile", "email"],
         },
      )

      setCookie("google_oauth_state", state, COOKIE_OPTIONS)
      setCookie("google_oauth_code_verifier", codeVerifier, COOKIE_OPTIONS)

      setHeader("Location", url.toString())

      return url.toString()
   },
)

export const logout = createServerFn({ method: "POST" }).handler(async () => {
   return match(getSessionTokenCookie())
      .with(undefined, () => "OK")
      .otherwise(async (sessionId) => {
         await invalidateAuthSession(sessionId)
         deleteSessionTokenCookie()

         return "OK"
      })
})
