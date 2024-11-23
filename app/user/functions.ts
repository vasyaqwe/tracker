import {
   deleteSessionTokenCookie,
   getSessionToken,
   github,
   google,
   invalidateSession,
} from "@/user/auth"
import { COOKIE_OPTIONS } from "@/user/constants"
import { updateUserParams, user } from "@/user/schema"
import { authMiddleware, baseMiddleware } from "@/utils/middleware"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { generateCodeVerifier, generateState } from "arctic"
import { eq } from "drizzle-orm"
import { match } from "ts-pattern"
import { setCookie, setHeader } from "vinxi/http"

export const me = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      return context.user
   })

export const update = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(zodValidator(updateUserParams))
   .handler(async ({ context, data }) => {
      return await context.db
         .update(user)
         .set(data)
         .where(eq(user.id, context.user.id))
   })

export const logInWithGithub = createServerFn({ method: "POST" })
   .middleware([baseMiddleware])
   .handler(async () => {
      const state = generateState()
      const url = await github().createAuthorizationURL(state, {
         scopes: ["user:email"],
      })

      setCookie("github_oauth_state", state, COOKIE_OPTIONS)

      setHeader("Location", url.toString())

      return url.toString()
   })

export const logInWithGoogle = createServerFn({ method: "POST" })
   .middleware([baseMiddleware])
   .handler(async () => {
      const state = generateState()
      const codeVerifier = generateCodeVerifier()
      const url = await google().createAuthorizationURL(state, codeVerifier, {
         scopes: ["profile", "email"],
      })
      console.log(COOKIE_OPTIONS)
      setCookie("google_oauth_state", state, COOKIE_OPTIONS)
      setCookie("google_oauth_code_verifier", codeVerifier, COOKIE_OPTIONS)

      setHeader("Location", url.toString())

      return url.toString()
   })

export const logout = createServerFn({ method: "POST" })
   .middleware([baseMiddleware])
   .handler(async () => {
      return match(getSessionToken())
         .with(undefined, () => "OK")
         .otherwise(async (sessionId) => {
            await invalidateSession(sessionId)
            deleteSessionTokenCookie()

            return "OK"
         })
   })
