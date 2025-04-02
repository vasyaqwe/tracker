import {
   SESSION_COOKIE_NAME,
   SESSION_EXPIRATION_SECONDS,
} from "@/auth/constants"
import { session } from "@/auth/schema"
import { COOKIE_OPTIONS } from "@/cookie/constants"
import { databaseClient } from "@/database"
import { user } from "@/user/schema"
import { sha256 } from "@oslojs/crypto/sha2"
import {
   encodeBase32LowerCaseNoPadding,
   encodeHexLowerCase,
} from "@oslojs/encoding"
import { eq } from "drizzle-orm"
import { getCookie, setCookie } from "vinxi/http"

const createSessionToken = () => {
   const bytes = new Uint8Array(20)
   crypto.getRandomValues(bytes)
   const token = encodeBase32LowerCaseNoPadding(bytes)
   return token
}

const setSessionTokenCookie = (token: string) => {
   setCookie(SESSION_COOKIE_NAME, token, {
      ...COOKIE_OPTIONS,
      maxAge: SESSION_EXPIRATION_SECONDS,
   })
}

export const getSessionTokenCookie = () => getCookie(SESSION_COOKIE_NAME)

export const deleteSessionTokenCookie = () => {
   setCookie(SESSION_COOKIE_NAME, "", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
   })
}

export const createAuthSession = async (userId: string) => {
   const db = databaseClient()

   const ownedProjects = await db.query.project.findMany({
      where: { ownerId: userId },
      columns: {
         id: true,
      },
   })

   const token = createSessionToken()
   const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

   await db
      .insert(session)
      .values({
         id: sessionId,
         userId,
         expiresAt: new Date(Date.now() + 1000 * SESSION_EXPIRATION_SECONDS),
         ownedProjects,
      })
      .returning()

   setSessionTokenCookie(token)
}

export const validateSessionToken = async (token: string) => {
   const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
   const db = databaseClient()

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

   // if less than 15 days left, extend the session
   if (
      Date.now() >=
      foundSession.expiresAt.getTime() - 1000 * 15 * 24 * 60 * 60
   ) {
      foundSession.expiresAt = new Date(
         Date.now() + 1000 * SESSION_EXPIRATION_SECONDS,
      )
      await db
         .update(session)
         .set({
            expiresAt: foundSession.expiresAt,
         })
         .where(eq(session.id, foundSession.id))
   }

   return { session: foundSession, user: foundUser }
}

export const invalidateAuthSession = async (sessionId: string) => {
   const db = databaseClient()

   return await db
      .delete(session)
      .where(
         eq(
            session.id,
            encodeHexLowerCase(sha256(new TextEncoder().encode(sessionId))),
         ),
      )
}
