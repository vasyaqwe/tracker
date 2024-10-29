import { protectedProcedure, publicProcedure } from "@/lib/trpc"
import {
   deleteSessionTokenCookie,
   getSessionToken,
   github,
   google,
   invalidateSession,
} from "@/user/auth"
import { COOKIE_OPTIONS } from "@/user/constants"
import { updateUserParams, user } from "@/user/schema"
import { createServerFn } from "@tanstack/start"
import { generateCodeVerifier, generateState } from "arctic"
import { eq } from "drizzle-orm"
import { match } from "ts-pattern"
import { setCookie, setHeader } from "vinxi/http"

export const me = createServerFn(
   "GET",
   protectedProcedure.query(async ({ ctx }) => {
      return ctx.auth
   }),
)

export const update = createServerFn(
   "POST",
   protectedProcedure
      .input(updateUserParams)
      .mutation(async ({ ctx, input }) => {
         return await ctx.db
            .update(user)
            .set(input)
            .where(eq(user.id, ctx.user.id))
      }),
)

export const logInWithGithub = createServerFn(
   "POST",
   publicProcedure.mutation(async () => {
      const state = generateState()
      const url = await github.createAuthorizationURL(state, {
         scopes: ["user:email"],
      })

      setCookie("github_oauth_state", state, COOKIE_OPTIONS)

      setHeader("Location", url.toString())

      return url.toString()
   }),
)

export const logInWithGoogle = createServerFn(
   "POST",
   publicProcedure.mutation(async () => {
      const state = generateState()
      const codeVerifier = generateCodeVerifier()
      const url = await google.createAuthorizationURL(state, codeVerifier, {
         scopes: ["profile", "email"],
      })

      setCookie("google_oauth_state", state, COOKIE_OPTIONS)
      setCookie("google_oauth_code_verifier", codeVerifier, COOKIE_OPTIONS)

      setHeader("Location", url.toString())

      return url.toString()
   }),
)

export const logout = createServerFn(
   "POST",
   publicProcedure.mutation(async () => {
      return match(getSessionToken())
         .with(undefined, () => "OK")
         .otherwise(async (sessionId) => {
            await invalidateSession(sessionId)
            deleteSessionTokenCookie()

            return "OK"
         })
   }),
)
