import { defineRelations } from "drizzle-orm"
import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
   emailVerificationCode: {
      user: r.one.user({
         from: r.emailVerificationCode.userId,
         to: r.user.id,
      }),
   },
   user: {
      emailVerificationCodes: r.many.emailVerificationCode(),
      oauthAccounts: r.many.oauthAccount(),
      sessions: r.many.session(),
      projects: r.many.project(),
   },
   oauthAccount: {
      user: r.one.user({
         from: r.oauthAccount.userId,
         to: r.user.id,
      }),
   },
   session: {
      user: r.one.user({
         from: r.session.userId,
         to: r.user.id,
      }),
   },
   project: {
      user: r.one.user({
         from: r.project.ownerId,
         to: r.user.id,
      }),
      summaries: r.many.summary(),
   },
   summary: {
      project: r.one.project({
         from: r.summary.projectId,
         to: r.project.id,
      }),
   },
}))
