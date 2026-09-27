import { Delete02Icon, NoteIcon } from "@hugeicons/core-free-icons"
import { createFileRoute } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import { useQuery } from "convex-helpers/react/cache"
import * as React from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatDay, formatDuration } from "@/date"
import { toastError } from "@/error"
import { formatMoney } from "@/number"
import { useProject } from "@/project/hooks"
import {
   ActionBar,
   ActionBarGroup,
   ActionBarItem,
   ActionBarSelection,
   ActionBarSeparator,
} from "@/ui/components/action-bar"
import { AlertDialog } from "@/ui/components/alert-dialog"
import { Checkbox } from "@/ui/components/checkbox"
import { Icon } from "@/ui/components/icon"
import { Table } from "@/ui/components/table"

export const Route = createFileRoute("/_authed/$projectId/")({
   component: RouteComponent,
})

function RouteComponent() {
   const project = useProject()
   const summaries = useQuery(api.summary.list, { projectId: project._id })
   const [selected, setSelected] = React.useState<Set<Id<"summary">>>(new Set())
   const remove = useMutation(api.summary.remove).withOptimisticUpdate(
      (store, { projectId, summaryIds }) => {
         const current = store.getQuery(api.summary.list, { projectId })
         if (current)
            store.setQuery(
               api.summary.list,
               { projectId },
               current.filter((summary) => !summaryIds.includes(summary._id)),
            )
      },
   )

   if (summaries === undefined) return null

   if (summaries.length === 0)
      return (
         <p className="mx-auto mt-6 flex max-w-[30ch] flex-col items-center gap-3 text-balance text-center text-muted md:mt-1">
            <Icon
               icon={NoteIcon}
               className="size-7"
            />
            Start recording your work, sessions will appear here.
         </p>
      )

   let seconds = 0
   let earned = 0
   for (const summary of summaries) {
      if (!selected.has(summary._id)) continue
      seconds += summary.durationSeconds
      earned += summary.amountEarned
   }

   return (
      <div className="relative">
         <ActionBar
            open={selected.size > 0}
            onOpenChange={(open) => {
               if (!open) setSelected(new Set())
            }}
            sideOffset={80}
         >
            <ActionBarSelection>
               {formatMoney(earned)}
               <ActionBarSeparator />
               {formatDuration(seconds)}
            </ActionBarSelection>
            <ActionBarSeparator />
            <ActionBarGroup>
               <AlertDialog.Root>
                  <AlertDialog.Trigger
                     render={<ActionBarItem variant="destructive" />}
                  >
                     <Icon icon={Delete02Icon} />
                     Delete
                  </AlertDialog.Trigger>
                  <AlertDialog.Popup>
                     <AlertDialog.Title>
                        Delete selected summaries?
                     </AlertDialog.Title>
                     <AlertDialog.Description>
                        Are you absolutely sure? This is irreversible.
                     </AlertDialog.Description>
                     <AlertDialog.Footer>
                        <AlertDialog.Cancel />
                        <AlertDialog.Action
                           onClick={() => {
                              const summaryIds = [...selected]
                              setSelected(new Set())
                              remove({
                                 projectId: project._id,
                                 summaryIds,
                              }).catch(toastError)
                           }}
                        >
                           Yes, delete
                        </AlertDialog.Action>
                     </AlertDialog.Footer>
                  </AlertDialog.Popup>
               </AlertDialog.Root>
            </ActionBarGroup>
         </ActionBar>
         <div className="relative flex flex-col rounded-2xl bg-surface-2 p-1 [--card:var(--color-white)]">
            <Table.Root variant="card">
               <Table.Header>
                  <Table.Row>
                     <Table.Head>
                        <Checkbox
                           aria-label="Select all"
                           checked={selected.size === summaries.length}
                           indeterminate={
                              selected.size > 0 &&
                              selected.size < summaries.length
                           }
                           onCheckedChange={(checked) =>
                              setSelected(
                                 new Set(
                                    checked
                                       ? summaries.map((summary) => summary._id)
                                       : [],
                                 ),
                              )
                           }
                        />
                     </Table.Head>
                     <Table.Head>Date</Table.Head>
                     <Table.Head>Duration</Table.Head>
                     <Table.Head>Earnings</Table.Head>
                  </Table.Row>
               </Table.Header>
               <Table.Body>
                  {summaries.map((summary) => (
                     <Table.Row
                        key={summary._id}
                        data-state={
                           selected.has(summary._id) ? "selected" : undefined
                        }
                        className="cursor-pointer select-none"
                        onClick={() => {
                           const next = new Set(selected)
                           if (next.has(summary._id)) next.delete(summary._id)
                           else next.add(summary._id)
                           setSelected(next)
                        }}
                     >
                        <Table.Cell className="pe-0.5!">
                           <Checkbox
                              aria-label={`Select ${formatDay(summary.day)}`}
                              checked={selected.has(summary._id)}
                              onClick={(event) => event.stopPropagation()}
                              onCheckedChange={(checked) => {
                                 const next = new Set(selected)
                                 if (checked) next.add(summary._id)
                                 else next.delete(summary._id)
                                 setSelected(next)
                              }}
                           />
                        </Table.Cell>
                        <Table.Cell>{formatDay(summary.day)}</Table.Cell>
                        <Table.Cell className="tabular-nums">
                           {formatDuration(summary.durationSeconds)}
                        </Table.Cell>
                        <Table.Cell className="tabular-nums">
                           {formatMoney(summary.amountEarned)}
                        </Table.Cell>
                     </Table.Row>
                  ))}
               </Table.Body>
            </Table.Root>
         </div>
      </div>
   )
}
