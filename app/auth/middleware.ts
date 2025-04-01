import {
   deleteSessionTokenCookie,
   getSessionTokenCookie,
   validateSessionToken,
} from "@/auth/utils"
import { publicEnv } from "@/env"
import { ServerFnError } from "@/error"
import { baseMiddleware } from "@/middleware"
import { createMiddleware } from "@tanstack/start"
import { getHeader, getWebRequest } from "vinxi/http"

const auth = async () => {
   // csrf protection
   const request = getWebRequest()
   if (request.method !== "GET") {
      const origin = getHeader("Origin")
      // You can also compare it against the Host or X-Forwarded-Host header.
      if (origin === null || origin !== publicEnv.VITE_BASE_URL) {
         return {
            user: null,
            session: null,
         }
      }
   }

   const sessionToken = getSessionTokenCookie()

   if (!sessionToken)
      return {
         user: null,
         session: null,
      }

   const { session, user } = await validateSessionToken(sessionToken)

   if (!session) {
      deleteSessionTokenCookie()
   }

   return {
      user,
      session,
   }
}

export const authMiddleware = createMiddleware()
   .middleware([baseMiddleware])
   .server(async ({ next }) => {
      const result = await auth()

      if (!result.session || !result.user)
         throw new ServerFnError({ code: "UNAUTHORIZED" })

      return next({
         context: {
            session: result.session,
            user: result.user,
         },
      })
   })
