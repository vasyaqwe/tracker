import { database } from "@/db"
import { publicEnv } from "@/env"
import { project } from "@/project/schema"
import { session, user } from "@/user/schema"
import { sha256 } from "@oslojs/crypto/sha2"
import {
   encodeBase32LowerCaseNoPadding,
   encodeHexLowerCase,
} from "@oslojs/encoding"
import { GitHub, Google } from "arctic"
import { eq } from "drizzle-orm"
import {
   getCookie,
   getEvent,
   getHeader,
   getWebRequest,
   setCookie,
} from "vinxi/http"

export const github = () => {
   const env = getEvent().context.cloudflare.env
   return new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, {})
}

export const google = () => {
   const env = getEvent().context.cloudflare.env
   return new Google(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      `${publicEnv.VITE_BASE_URL}/api/auth/callback/google`,
   )
}

export const createSession = async (userId: string) => {
   const db = database()

   const ownedProjects = await db.query.project.findMany({
      where: eq(project.ownerId, userId),
      columns: {
         id: true,
      },
   })

   const token = generateSessionToken()

   const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
   const newSession = {
      id: sessionId,
      userId: userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      ownedProjects,
   }

   await db.insert(session).values(newSession).returning()

   setSessionTokenCookie(token, newSession.expiresAt)
}

export const SESSION_COOKIE_NAME = "auth_session"

export const getSessionToken = () => getCookie(SESSION_COOKIE_NAME)

export const auth = async () => {
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

   const sessionToken = getSessionToken()

   if (!sessionToken)
      return {
         user: null,
         session: null,
      }

   const { session, user } = await validateSessionToken(sessionToken)

   if (session !== null && Date.now() >= session.expiresAt.getTime()) {
      await createSession(user.id)
   }

   if (!session) {
      deleteSessionTokenCookie()
   }

   return {
      user,
      session,
   }
}

export type Auth = Awaited<ReturnType<typeof auth>>

export const setSessionTokenCookie = (token: string, expiresAt: Date) => {
   setCookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: import.meta.env.PROD,
      expires: expiresAt,
      path: "/",
   })
}

export const deleteSessionTokenCookie = () => {
   setCookie(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: import.meta.env.PROD,
      maxAge: 0,
      path: "/",
   })
}

export const generateSessionToken = () => {
   const bytes = new Uint8Array(20)
   crypto.getRandomValues(bytes)
   const token = encodeBase32LowerCaseNoPadding(bytes)
   return token
}

export const validateSessionToken = async (token: string) => {
   const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
   const db = database()

   const found = await db
      .select({ foundUser: user, foundSession: session })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(eq(session.id, sessionId))
      .get()

   if (!found) return { session: null, user: null }

   const { foundUser, foundSession } = found

   if (Date.now() >= foundSession.expiresAt.getTime()) {
      await db.delete(session).where(eq(session.id, foundSession.id))
      return { session: null, user: null }
   }

   if (
      Date.now() >=
      foundSession.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15
   ) {
      foundSession.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      await db
         .update(session)
         .set({
            expiresAt: foundSession.expiresAt,
         })
         .where(eq(session.id, foundSession.id))
   }

   return { session: foundSession, user: foundUser }
}

export const invalidateSession = async (sessionId: string) => {
   const db = database()

   return await db
      .delete(session)
      .where(
         eq(
            session.id,
            encodeHexLowerCase(sha256(new TextEncoder().encode(sessionId))),
         ),
      )
}
