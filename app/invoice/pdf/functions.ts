import { InvoicePdf } from "@/invoice/pdf"
import { renderToStream } from "@react-pdf/renderer"
import { createServerFn } from "@tanstack/start"
import { getWebRequest } from "vinxi/http"

export const generate = createServerFn("GET", async () => {
   const request = getWebRequest()
   const requestUrl = new URL(request.url)
   const size = (requestUrl.searchParams.get("size") as "letter" | "a4") ?? "a4"
   const preview = requestUrl.searchParams.get("preview") === "true"

   // if (!data) {
   //    return new Response("Invoice not found", { status: 404 })
   // }

   const stream = await renderToStream(
      await InvoicePdf({
         amount: 213,
         dueDate: new Date().getTime(),
         invoiceNumber: "123",
         issueDate: new Date().getTime(),
         lineItems: [{ name: "test", price: 123, quantity: 1 }],
         customerDetails: {
            content: [
               {
                  type: "paragraph",
                  content: [
                     {
                        type: "text",
                        text: "Your Company Name",
                     },
                  ],
               },
               {
                  type: "paragraph",
                  content: [
                     {
                        type: "text",
                        text: "123 Business Street",
                     },
                  ],
               },
               {
                  type: "paragraph",
                  content: [
                     {
                        type: "text",
                        text: "City, State ZIP",
                     },
                  ],
               },
            ],
            type: "doc",
         },
         fromDetails: {
            content: [
               {
                  type: "paragraph",
                  content: [
                     {
                        type: "text",
                        text: "Your Company Name",
                     },
                  ],
               },
               {
                  type: "paragraph",
                  content: [
                     {
                        type: "text",
                        text: "123 Business Street",
                     },
                  ],
               },
               {
                  type: "paragraph",
                  content: [
                     {
                        type: "text",
                        text: "City, State ZIP",
                     },
                  ],
               },
            ],
            type: "doc",
         },
         size,
      }),
   )

   // @ts-expect-error ...
   const blob = await new Response(stream).blob()

   const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, max-age=0",
   }

   if (!preview) {
      headers["Content-Disposition"] = `attachment; filename="123.pdf"`
   }

   return new Response(blob, { headers })
})
