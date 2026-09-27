import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "@/ui/utils"

export type TableVariant = "default" | "card"

export type TableProps = React.ComponentProps<"table"> & {
   variant?: TableVariant
   render?: useRender.ComponentProps<"div">["render"]
}

function Root({
   className,
   variant = "default",
   render,
   ...props
}: TableProps): React.ReactElement {
   const defaultProps = {
      children: (
         <table
            className={cn(
               "w-full caption-bottom in-data-[variant=card]:border-separate in-data-[variant=card]:border-spacing-0 text-sm",
               className,
            )}
            data-slot="table"
            {...props}
         />
      ),
      className:
         "relative w-full overflow-x-auto scrollbar-hidden data-[variant=card]:p-px",
      "data-slot": "table-container",
      "data-variant": variant,
   }

   return useRender({
      defaultTagName: "div",
      props: mergeProps<"div">(defaultProps, {}),
      render,
   })
}

function Header({
   className,
   ...props
}: React.ComponentProps<"thead">): React.ReactElement {
   return (
      <thead
         className={cn("[&_tr]:border-b", className)}
         data-slot="table-header"
         {...props}
      />
   )
}

function Body({
   className,
   ...props
}: React.ComponentProps<"tbody">): React.ReactElement {
   return (
      <tbody
         className={cn(
            "relative in-data-[variant=card]:rounded-xl in-data-[variant=card]:shadow-2xs/2 before:pointer-events-none before:absolute before:inset-px not-in-data-[variant=card]:before:hidden before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] supports-[background:-webkit-named-image(i)]:before:hidden [&_tr:last-child]:border-0 in-data-[variant=card]:*:[tr]:border-0 in-data-[variant=card]:*:[tr]:*:[td]:border-b in-data-[variant=card]:*:[tr]:*:[td]:bg-white in-data-[variant=card]:*:[tr]:first:*:[td]:first:rounded-ss-xl in-data-[variant=card]:*:[tr]:*:[td]:first:border-s in-data-[variant=card]:*:[tr]:first:*:[td]:border-t in-data-[variant=card]:*:[tr]:last:*:[td]:last:rounded-ee-xl in-data-[variant=card]:*:[tr]:*:[td]:last:border-e in-data-[variant=card]:*:[tr]:first:*:[td]:last:rounded-se-xl in-data-[variant=card]:*:[tr]:last:*:[td]:first:rounded-es-xl in-data-[variant=card]:*:[tr]:hover:*:[td]:bg-surface-1 in-data-[variant=card]:*:[tr]:data-[state=selected]:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_4%)]",
            className,
         )}
         data-slot="table-body"
         {...props}
      />
   )
}

function Footer({
   className,
   ...props
}: React.ComponentProps<"tfoot">): React.ReactElement {
   return (
      <tfoot
         className={cn(
            "border-t in-data-[variant=card]:border-none bg-transparent not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] [&>tr]:last:border-b-0",
            className,
         )}
         data-slot="table-footer"
         {...props}
      />
   )
}

function Row({
   className,
   ...props
}: React.ComponentProps<"tr">): React.ReactElement {
   return (
      <tr
         className={cn(
            "relative border-b not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-black)_2%)] not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-black)_4%)]",
            className,
         )}
         data-slot="table-row"
         {...props}
      />
   )
}

function Head({
   className,
   ...props
}: React.ComponentProps<"th">): React.ReactElement {
   return (
      <th
         className={cn(
            "whitespace-nowrap px-2.5 pt-2 pb-3 text-left align-middle font-normal text-muted leading-none has-[[role=checkbox]]:w-px last:has-[[role=checkbox]]:ps-0 first:has-[[role=checkbox]]:pe-0",
            className,
         )}
         data-slot="table-head"
         {...props}
      />
   )
}

function Cell({
   className,
   ...props
}: React.ComponentProps<"td">): React.ReactElement {
   return (
      <td
         className={cn(
            "whitespace-nowrap bg-clip-padding p-2.5 in-data-[slot=table-footer]:pt-3.5 in-data-[slot=table-footer]:pb-3 align-middle leading-none in-data-[variant=card]:first:ps-[calc(--spacing(2.5)-1px)] in-data-[variant=card]:last:pe-[calc(--spacing(2.5)-1px)] has-[[role=checkbox]]:w-px last:has-[[role=checkbox]]:ps-0 first:has-[[role=checkbox]]:pe-0",
            className,
         )}
         data-slot="table-cell"
         {...props}
      />
   )
}

function Caption({
   className,
   ...props
}: React.ComponentProps<"caption">): React.ReactElement {
   return (
      <caption
         className={cn(
            "in-data-[variant=card]:my-4 mt-4 text-muted text-sm",
            className,
         )}
         data-slot="table-caption"
         {...props}
      />
   )
}

export const Table = {
   Root,
   Header,
   Body,
   Footer,
   Row,
   Head,
   Cell,
   Caption,
}
