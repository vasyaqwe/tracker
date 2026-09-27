import { defineSchema } from "convex/server"
import { projectTable } from "@/project/schema"
import { summaryTable } from "@/summary/schema"
import { userTable } from "@/user/schema"

const schema = defineSchema({
   user: userTable,
   project: projectTable,
   summary: summaryTable,
})

export default schema
