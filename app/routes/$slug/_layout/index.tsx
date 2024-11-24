import { useDelayedValue } from "@/interactions/use-delayed-value"
import * as invoice from "@/invoice/pdf/functions"
import { Main } from "@/routes/$slug/-components/main"
import { summaryListQuery } from "@/summary/queries"
import { Button, buttonVariants } from "@/ui/components/button"
import { Card } from "@/ui/components/card"
import { Loading } from "@/ui/components/loading"
import { Modal } from "@/ui/components/modal"
import { Table } from "@/ui/components/table"
import { TextField } from "@/ui/components/text-field"
import { TransitionHeight } from "@/ui/components/transition-height"
import { useAuth } from "@/user/hooks"
import {
   formatCurrency,
   formatDate,
   formatDateIntl,
   formatTime,
} from "@/utils/format"
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
   head: () => ({
      meta: [{ title: "Home" }],
   }),
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

   const [isOpen, setIsOpen] = useState(false)
   const generateInvoiceFn = useServerFn(invoice.generate)
   const generateInvoice = useMutation({
      mutationFn: generateInvoiceFn,
      onSuccess: async (data) => {
         setIsOpen(false)
         setSelectedKeys(new Set())

         const binaryString = window.atob(data.base64Pdf)
         const bytes = new Uint8Array(binaryString.length)
         for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
         }
         const blob = new Blob([bytes], { type: "application/pdf" })

         const url = window.URL.createObjectURL(blob)
         const a = document.createElement("a")
         a.style.display = "none"
         a.href = url
         a.download = data.fileName
         document.body.appendChild(a)
         a.click()
         window.URL.revokeObjectURL(url)
      },
   })

   return (
      <Main>
         <main className="relative">
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
                     className="md:-translate-y-[100%] top-0 w-full md:absolute"
                     data-expanded={Array.from(selectedKeys).length > 0}
                  >
                     <Card className="mb-2 flex items-center justify-between px-3 py-2 ">
                        <p className="font-medium">
                           {formatCurrency(selectedEarnings)}{" "}
                           <span className="font-normal opacity-70">•</span>{" "}
                           {formatTime(selectedDuration)}
                        </p>
                        <Modal
                           isOpen={isOpen}
                           onOpenChange={(open) => {
                              setIsOpen(open)
                              if (open) generateInvoice.reset()
                           }}
                        >
                           <Modal.Trigger className={buttonVariants()}>
                              <svg
                                 width="19"
                                 height="19"
                                 viewBox="0 0 20 20"
                                 fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <path
                                    d="M8.67236 1.00004C8.88223 0.999894 9.07321 0.999764 9.25201 1.00779L9.25201 2.74957C9.25198 3.64831 9.25195 4.39774 9.33199 4.99269C9.41646 5.62067 9.60229 6.18763 10.0581 6.64323C10.514 7.09883 11.0813 7.28455 11.7096 7.36898C12.3049 7.44897 13.0548 7.44895 13.954 7.44892L15.6911 7.44892C15.7051 7.69146 15.7048 7.95126 15.7045 8.23511L15.7045 11.6829C15.7045 11.7932 15.7045 11.9015 15.7044 12.0075H7.98536C6.98943 12.0075 6.49146 12.0075 6.18206 12.3777C5.87266 12.7478 5.87266 13.3435 5.87266 14.535V18.9589C5.72258 18.9507 5.579 18.9408 5.44153 18.9287C4.67032 18.8607 4.02037 18.7186 3.43437 18.3912C2.66686 17.9624 2.03337 17.3293 1.60433 16.5622C1.27676 15.9765 1.1346 15.3269 1.06652 14.5562C0.999989 13.8028 0.999994 12.8656 1 11.6829V8.54346C0.999992 7.25247 0.999986 6.2295 1.07875 5.41027C1.1594 4.57141 1.32804 3.86818 1.71544 3.24474C2.10114 2.62403 2.62487 2.10059 3.24592 1.71511C3.86972 1.32793 4.57335 1.15939 5.41268 1.07878C6.23237 1.00006 7.25592 1.00007 8.54764 1.00008L8.67236 1.00004Z"
                                    fill="currentColor"
                                 />
                                 <path
                                    d="M11.4741 2.1599C11.2114 1.89701 10.9906 1.67602 10.7533 1.50259V2.69756C10.7533 3.66185 10.7549 4.30959 10.8199 4.79277C10.882 5.25436 10.9893 5.45191 11.1197 5.58227C11.2501 5.71262 11.4478 5.81987 11.9097 5.88193C12.3931 5.94689 13.0412 5.94849 14.006 5.94849H15.1914C14.9809 5.66359 14.7098 5.39315 14.3976 5.08174L11.4741 2.1599Z"
                                    fill="currentColor"
                                 />
                                 <path
                                    d="M16.4498 19H16.7133C16.9062 19 17.0027 19 17.0616 18.9397C17.1205 18.8794 17.1182 18.783 17.1136 18.5903L17.071 16.8204H18.3944C18.5831 16.8204 18.6775 16.8204 18.7361 16.7618C18.7947 16.7032 18.7947 16.6089 18.7947 16.4203V16.3341C18.7947 16.1454 18.7947 16.0511 18.7361 15.9925C18.6775 15.9339 18.5831 15.9339 18.3944 15.9339H17.0497V14.5566H18.5997C18.7884 14.5566 18.8827 14.5566 18.9414 14.498C19 14.4394 19 14.3451 19 14.1565V14.0666C19 13.8779 19 13.7836 18.9414 13.725C18.8827 13.6664 18.7884 13.6664 18.5997 13.6664H16.4498C16.2611 13.6664 16.1668 13.6664 16.1081 13.725C16.0495 13.7836 16.0495 13.8779 16.0495 14.0666V18.5999C16.0495 18.7885 16.0495 18.8828 16.1081 18.9414C16.1668 19 16.2611 19 16.4498 19Z"
                                    fill="currentColor"
                                 />
                                 <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8.05862 19H7.78906C7.60033 19 7.50597 19 7.44734 18.9414C7.38872 18.8828 7.38872 18.7885 7.38872 18.5999V14.0666C7.38872 13.8779 7.38872 13.7836 7.44734 13.725C7.50597 13.6664 7.60033 13.6664 7.78906 13.6664H9.20666C9.56586 13.6664 9.87496 13.7422 10.134 13.8936C10.393 14.045 10.5909 14.2538 10.7277 14.52C10.867 14.7837 10.9366 15.0865 10.9366 15.4284C10.9366 15.7728 10.867 16.0719 10.7277 16.3259C10.5909 16.5774 10.393 16.7728 10.134 16.912C9.87496 17.0512 9.56586 17.1208 9.20666 17.1208H8.8593C8.67058 17.1208 8.57622 17.1208 8.51759 17.1794C8.45896 17.238 8.45896 17.3323 8.45896 17.5209V18.5999C8.45896 18.7885 8.45896 18.8828 8.40033 18.9414C8.3417 19 8.24734 19 8.05862 19ZM9.20666 16.2307C9.35816 16.2307 9.48155 16.1965 9.57685 16.1281C9.67459 16.0597 9.74545 15.9657 9.78943 15.846C9.83342 15.7239 9.85541 15.5872 9.85541 15.4358C9.85541 15.2819 9.83219 15.139 9.78577 15.0072C9.74179 14.8728 9.67215 14.7642 9.57685 14.6811C9.484 14.5981 9.3606 14.5566 9.20666 14.5566H8.8593C8.67058 14.5566 8.57622 14.5566 8.51759 14.6152C8.45896 14.6738 8.45896 14.7681 8.45896 14.9567V15.8305C8.45896 16.0192 8.45896 16.1135 8.51759 16.1721C8.57622 16.2307 8.67058 16.2307 8.8593 16.2307H9.20666Z"
                                    fill="currentColor"
                                 />
                                 <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M13.1228 19H12.1304C11.9417 19 11.8473 19 11.7887 18.9414C11.73 18.8828 11.73 18.7885 11.73 18.5999V14.0666C11.73 13.8779 11.73 13.7836 11.7887 13.725C11.8473 13.6664 11.9417 13.6664 12.1304 13.6664H13.1375C13.4454 13.6664 13.7251 13.7165 13.9768 13.8166C14.2285 13.9168 14.4447 14.0633 14.6256 14.2562C14.8064 14.4467 14.9457 14.6824 15.0434 14.9632C15.1411 15.244 15.19 15.564 15.19 15.923V16.7472C15.19 17.1086 15.1411 17.4285 15.0434 17.7069C14.9457 17.9853 14.8064 18.221 14.6256 18.4139C14.4472 18.6044 14.2309 18.7497 13.9768 18.8498C13.7227 18.9499 13.438 19 13.1228 19ZM13.1228 18.1135C13.3818 18.1135 13.5834 18.0671 13.7276 17.9743C13.8718 17.8815 13.9732 17.735 14.0318 17.5347C14.0929 17.3345 14.1234 17.072 14.1234 16.7472V15.9156C14.1234 15.669 14.1075 15.4602 14.0758 15.2892C14.044 15.1158 13.9903 14.9766 13.9145 14.8716C13.8388 14.7642 13.7374 14.6848 13.6103 14.6335C13.4832 14.5822 13.3256 14.5566 13.1375 14.5566C13.0128 14.5566 12.9505 14.5566 12.9041 14.5834C12.8736 14.6009 12.8483 14.6262 12.8307 14.6567C12.804 14.7031 12.804 14.7654 12.804 14.8899V17.7948C12.804 17.9055 12.804 17.9609 12.8253 18.0033C12.8446 18.0417 12.8758 18.0729 12.9142 18.0922C12.9566 18.1135 13.012 18.1135 13.1228 18.1135Z"
                                    fill="currentColor"
                                 />
                              </svg>
                              Generate invoice
                           </Modal.Trigger>
                           <Modal.Content size={"sm"}>
                              <Modal.Header>
                                 <Modal.Title>Generate invoice</Modal.Title>
                                 <Modal.Description>
                                    Get an PDF invoice for the selected
                                    summaries.
                                 </Modal.Description>
                              </Modal.Header>
                              <form
                                 id="invoice"
                                 onSubmit={(e) => {
                                    e.preventDefault()

                                    const formData = Object.fromEntries(
                                       new FormData(
                                          e.target as HTMLFormElement,
                                       ).entries(),
                                    ) as {
                                       name: string
                                       email: string
                                    }

                                    generateInvoice.mutate({
                                       data: {
                                          name: formData.name,
                                          email: formData.email,
                                          selectedItems: selectedItems.map(
                                             (item) => ({
                                                price: +item.amountEarned,
                                                description: `${formatTime(
                                                   item.durationMinutes,
                                                   {
                                                      short: false,
                                                   },
                                                )} on ${formatDateIntl(
                                                   item.createdAt,
                                                )}`,
                                             }),
                                          ),
                                          amount: selectedEarnings,
                                       },
                                    })
                                 }}
                              >
                                 <TextField
                                    autoFocus
                                    isRequired
                                    className={"mb-2"}
                                    placeholder="Acme Inc."
                                    label="Company name"
                                    name="name"
                                 />
                                 <TextField
                                    isRequired
                                    className={"mb-1"}
                                    placeholder="acme@example.com"
                                    label="Company email address"
                                    name="email"
                                    type="email"
                                 />
                              </form>
                              <Modal.Footer>
                                 <Button
                                    type="submit"
                                    form="invoice"
                                    className={"w-full"}
                                    isDisabled={
                                       generateInvoice.isPending ||
                                       generateInvoice.isSuccess
                                    }
                                 >
                                    {generateInvoice.isPending ||
                                    generateInvoice.isSuccess ? (
                                       <Loading />
                                    ) : (
                                       "Download"
                                    )}
                                 </Button>
                              </Modal.Footer>
                           </Modal.Content>
                        </Modal>
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
