import { useDelayedValue } from "@/interactions/use-delayed-value"
import * as invoice from "@/invoice/pdf/functions"
import { Main } from "@/routes/$slug/-components/main"
import { summaryListQuery } from "@/summary/queries"
import { Card } from "@/ui/components/card"
import { Table } from "@/ui/components/table"
import { TransitionHeight } from "@/ui/components/transition-height"
import { useAuth } from "@/user/hooks"
import { formatCurrency, formatDate, formatTime } from "@/utils/format"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { useState } from "react"
import type { Selection } from "react-aria-components"

export const Route = createFileRoute("/$slug/_layout/")({
   component: Component,
   loader: async ({ context }) => {
      context.queryClient.prefetchQuery(
         summaryListQuery({ projectId: context.projectId }),
      )
   },
   meta: () => [{ title: "Home" }],
})

function Component() {
   const { projectId } = useAuth()
   const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

   const summaries = useSuspenseQuery(summaryListQuery({ projectId }))

   const selectedIds = Array.from(selectedKeys)
   const selectedItems =
      selectedKeys === "all"
         ? summaries.data
         : summaries.data.filter((item) => selectedIds.includes(item.id))

   const selectedEarnings = useDelayedValue(
      selectedItems.reduce((acc, curr) => acc + +curr.amountEarned, 0),
      500,
   )
   const selectedDuration = useDelayedValue(
      selectedItems.reduce((acc, curr) => acc + curr.durationMinutes, 0),
      500,
   )

   const generateInvoiceFn = useServerFn(invoice.generate)
   const _generateInvoice = useMutation({
      mutationFn: generateInvoiceFn,
      onSuccess: async (response) => {
         const blob = await response.blob()
         const url = window.URL.createObjectURL(blob)
         const a = document.createElement("a")
         a.style.display = "none"
         a.href = url
         a.download = "invoice.pdf"
         document.body.appendChild(a)
         a.click()
         window.URL.revokeObjectURL(url)
      },
   })

   return (
      <Main>
         <main>
            {summaries.data.length === 0 ? (
               <p className="mx-auto mt-6 flex max-w-[30ch] flex-col items-center gap-3 text-balance text-center font-medium text-foreground/70 md:mt-1">
                  <svg
                     className="size-7"
                     viewBox="0 0 20 20"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.9031 1H11.9251C13.3987 0.999985 14.5747 0.999972 15.497 1.12494C16.4499 1.25405 17.2346 1.52789 17.8554 2.15353C18.4762 2.77917 18.7479 3.57001 18.876 4.5303C19 5.45984 19 6.64503 19 8.13012V9.16011C19 10.6452 19 11.8304 18.876 12.7599C18.7479 13.7202 18.4762 14.5111 17.8554 15.1367C17.2346 15.7623 16.4499 16.0362 15.497 16.1653C14.5747 16.2903 13.3987 16.2902 11.9251 16.2902H10.9031C9.42946 16.2902 8.25345 16.2903 7.3311 16.1653C6.37825 16.0362 5.59353 15.7623 4.97273 15.1367C4.35194 14.5111 4.08022 13.7202 3.95211 12.7599C3.8281 11.8304 3.82812 10.6452 3.82813 9.16012V8.13012C3.82812 6.64503 3.8281 5.45984 3.95211 4.5303C4.08022 3.57001 4.35194 2.77917 4.97273 2.15353C5.59353 1.52789 6.37825 1.25405 7.3311 1.12494C8.25344 0.999972 9.42947 0.999985 10.9031 1ZM8.14032 4.60778C7.72418 4.60778 7.38683 4.94777 7.38683 5.36716C7.38683 5.78655 7.72418 6.12654 8.14032 6.12654H14.5272C14.9433 6.12654 15.2807 5.78655 15.2807 5.36716C15.2807 4.94777 14.9433 4.60778 14.5272 4.60778H8.14032ZM8.14032 7.36637C7.72418 7.36637 7.38683 7.70635 7.38683 8.12575C7.38683 8.54514 7.72418 8.88512 8.14032 8.88512H14.5272C14.9433 8.88512 15.2807 8.54514 15.2807 8.12575C15.2807 7.70635 14.9433 7.36637 14.5272 7.36637H8.14032ZM7.38683 10.8843C7.38683 10.4649 7.72418 10.125 8.14032 10.125H11.79C12.2061 10.125 12.5435 10.4649 12.5435 10.8843C12.5435 11.3037 12.2061 11.6437 11.79 11.6437H8.14032C7.72418 11.6437 7.38683 11.3037 7.38683 10.8843Z"
                        fill="currentColor"
                     />
                     <path
                        d="M1.7535 3.68831C1.33735 3.68831 1 4.0283 1 4.44769V7.26498C0.999991 9.81614 0.999983 11.8084 1.20715 13.3613C1.41881 14.9479 1.85907 16.1891 2.82413 17.1616C3.78919 18.1342 5.02074 18.5779 6.59505 18.7912C8.13592 19 10.1127 19 12.6441 19H15.4397C15.8558 19 16.1932 18.66 16.1932 18.2406C16.1932 17.8212 15.8558 17.4812 15.4397 17.4812H12.7024C10.1004 17.4812 8.22474 17.4796 6.79585 17.286C5.38866 17.0954 4.52813 16.7311 3.88974 16.0877C3.25135 15.4443 2.8899 14.5771 2.70071 13.1589C2.5086 11.7189 2.507 9.82858 2.507 7.20628V4.44769C2.507 4.0283 2.16965 3.68831 1.7535 3.68831Z"
                        fill="currentColor"
                     />
                  </svg>
                  Start recording your work, sessions over one minute long will
                  appear here.
               </p>
            ) : (
               <>
                  <TransitionHeight
                     data-expanded={Array.from(selectedKeys).length > 0}
                  >
                     <Card className="mb-2 flex items-center justify-between px-3 py-2 font-medium">
                        <p>
                           {formatCurrency(selectedEarnings)}{" "}
                           <span className="opacity-70">•</span>{" "}
                           {formatTime(selectedDuration)}
                        </p>
                        {/* <Button
                           onPress={() => generateInvoice.mutate()}
                        >
                           Download
                        </Button> */}
                     </Card>
                  </TransitionHeight>
                  <Table
                     key={projectId}
                     aria-label="Summaries"
                     selectionMode="multiple"
                     selectedKeys={selectedKeys}
                     onSelectionChange={setSelectedKeys}
                  >
                     <Table.Header>
                        <Table.Column isRowHeader>Date</Table.Column>
                        <Table.Column>Duration</Table.Column>
                        <Table.Column>Earnings</Table.Column>
                     </Table.Header>
                     <Table.Body items={summaries.data}>
                        {(item) => (
                           <Table.Row>
                              <Table.Cell data-thead="Date">
                                 {formatDate(item.createdAt)}
                              </Table.Cell>
                              <Table.Cell data-thead="Duration">
                                 {formatTime(item.durationMinutes)}
                              </Table.Cell>
                              <Table.Cell data-thead="Earnings">
                                 {formatCurrency(+item.amountEarned)}
                              </Table.Cell>
                           </Table.Row>
                        )}
                     </Table.Body>
                  </Table>
               </>
            )}
         </main>
      </Main>
   )
}
