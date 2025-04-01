import { authMiddleware } from "@/auth/middleware"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { getEvent, setHeaders } from "vinxi/http"
import { z } from "zod"

export const createInvoice = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .validator(
      zodValidator(
         z.object({
            customer: z.object({
               name: z.string().min(1),
               email: z.string().min(1),
            }),
            amount: z.number(),
            selectedItems: z.array(
               z.object({ price: z.number(), description: z.string() }),
            ),
         }),
      ),
   )
   .handler(async ({ context, data }) => {
      const res = await fetch("https://api.vasyaqwe.com/invoice/generate", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            user: {
               name: context.user.name,
               email: context.user.email,
            },
            customer: {
               name: data.customer.name,
               email: data.customer.email,
            },
            amount: data.amount,
            selectedItems: data.selectedItems,
         }),
      })
      const result = (await res.json()) as {
         base64Pdf: string
         fileName: string
      }

      return handleResponse<{ base64Pdf: string; fileName: string }>(
         new Response(
            JSON.stringify({
               base64Pdf: result.base64Pdf,
               fileName: result.fileName,
            }),
            {
               headers: {
                  "Content-Type": "application/json",
               },
            },
         ),
      )
   })

// temporary fix
async function handleResponse<ResponseBody = unknown>(
   response: Response,
): Promise<ResponseBody> {
   const event = getEvent()
   setHeaders(event, Object.fromEntries(response.headers))
   return response.json() as ResponseBody
}
