import { cn } from "@/ui/utils"
import { cva } from "class-variance-authority"
import * as React from "react"
import type {
   CellProps,
   ColumnProps,
   RowProps,
   TableBodyProps,
   TableHeaderProps,
   TableProps as TablePrimitiveProps,
} from "react-aria-components"
import {
   Cell,
   Collection,
   Column,
   ResizableTableContainer,
   Row,
   TableBody,
   TableHeader,
   Table as TablePrimitive,
   useTableOptions,
} from "react-aria-components"
import { Checkbox } from "./checkbox"

const root = cn(
   "table w-full caption-bottom border-spacing-0 text-sm outline-none",
)
const header = cn(
   "[&>tr]:!border-0 [&>tr]:bottom-0 [&>tr]:mt-1 max-md:hidden [&>tr]:before:border-none [&>tr]:bg-transparent",
)
const row = cn(
   "relative transition-colors before:absolute before:inset-0 before:bottom-0 before:z-[1] before:mx-auto before:h-px before:w-[calc(100%-0.75rem)]",
   "max-md:flex before:border-border before:border-t-2 before:border-dotted first:before:border-none",
   "md:[&:first-child>td]:mt-1 md:[&:last-child>td]:mb-1 max-md:flex-col max-md:gap-3 max-md:px-6 max-md:py-5",
   "tr group relative cursor-default outline-none focus-visible:after:block",
   "after:-inset-y-0 after:absolute after:inset-x-1 last:after:bottom-1 after:z-[-1] data-[selected=true]:after:block after:hidden first:after:rounded-t-[calc(15px-1px)] last:after:rounded-b-[calc(15px-1px)] after:bg-border/40",
)

type TableProps = TablePrimitiveProps & {
   className?: string
   allowResize?: boolean
}

const TableContext = React.createContext<TableProps>({
   allowResize: false,
})

const useTableContext = () => React.useContext(TableContext)

const Table = ({ children, className, ...props }: TableProps) => (
   <TableContext.Provider value={props}>
      <div className="relative w-full overflow-auto rounded-[calc(15px)] border border-border/40 bg-elevated">
         {props.allowResize ? (
            <ResizableTableContainer className="overflow-auto">
               <TablePrimitive
                  {...props}
                  className={cn(root, className)}
               >
                  {children}
               </TablePrimitive>
            </ResizableTableContainer>
         ) : (
            <TablePrimitive
               {...props}
               className={cn(root, className)}
            >
               {children}
            </TablePrimitive>
         )}
      </div>
   </TableContext.Provider>
)

const Body = <T extends object>(props: TableBodyProps<T>) => (
   <TableBody
      {...props}
      className={cn(
         "isolate before:absolute before:inset-1 md:before:top-12 before:z-[-1] before:rounded-[calc(15px-4px)] before:border before:border-border before:bg-background before:shadow-sm",
      )}
   />
)

type TableCellProps = CellProps & {
   className?: string
}

const cellVariants = cva(
   "grid-cols-[90px_1fr] items-center align-middle max-md:grid md:before:hidden max-md:w-full md:px-5 md:py-4 [&:has([role=checkbox])]:pr-0 before:font-medium before:font-primary before:text-foreground/60 before:text-sm",
   {
      variants: {
         allowResize: {
            true: "overflow-hidden truncate",
         },
      },
   },
)
const TableCell = ({ children, className, ...props }: TableCellProps) => {
   const { allowResize } = useTableContext()
   return (
      <Cell
         {...props}
         className={cellVariants({ allowResize, className })}
      >
         {children}
      </Cell>
   )
}

const columnVariants = cva(
   "h-12 px-5 text-left align-middle font-medium text-foreground/60 text-sm leading-none [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pr-0 [&:has([slot=selection])]:pr-0 first:pl-[26px] md:text-base",
   {
      variants: {
         isResizable: {
            true: "overflow-hidden truncate",
         },
      },
   },
)

type TableColumnProps = ColumnProps & {
   className?: string
   isResizable?: boolean
}

const TableColumn = ({
   children,
   isResizable = false,
   className,
   ...props
}: TableColumnProps) => {
   return (
      <Column
         {...props}
         className={columnVariants({
            isResizable,
            className,
         })}
      >
         {({ allowsSorting, isHovered }) => (
            <div className="flex items-center gap-2 [&_[data-slot=icon]]:shrink-0">
               <>
                  {children}
                  {allowsSorting && (
                     <>
                        <span className={cn(isHovered ? "" : "")}>
                           {/* <IconChevronLgDown
                              className={
                                 sortDirection === "ascending"
                                    ? "rotate-180"
                                    : ""
                              }
                           /> */}
                        </span>
                     </>
                  )}
               </>
            </div>
         )}
      </Column>
   )
}

type HeaderProps<T extends object> = TableHeaderProps<T> & {
   className?: string
}

const Header = <T extends object>({
   children,
   className,
   columns,
   ...props
}: HeaderProps<T>) => {
   const { selectionBehavior, selectionMode, allowsDragging } =
      useTableOptions()
   return (
      <TableHeader
         {...props}
         className={cn(header, className)}
      >
         {allowsDragging && <Column className="w-0" />}
         {selectionBehavior === "toggle" && (
            <Column className="w-0 pl-4">
               {selectionMode === "multiple" && <Checkbox slot="selection" />}
            </Column>
         )}
         <Collection items={columns}>{children}</Collection>
      </TableHeader>
   )
}

type TableRowProps<T extends object> = RowProps<T> & {
   className?: string
}

const TableRow = <T extends object>({
   children,
   className,
   columns,
   id,
   ...props
}: TableRowProps<T>) => {
   const { selectionBehavior } = useTableOptions()
   return (
      <Row
         id={id}
         {...props}
         className={cn(
            row,
            "href" in props ? cn("cursor-pointer", className) : "",
         )}
      >
         {selectionBehavior === "toggle" && (
            <Cell className="md:pl-4">
               <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 hidden h-full w-0.5 bg-primary group-selected:block"
               />
               <Checkbox slot="selection" />
            </Cell>
         )}
         <Collection items={columns}>{children}</Collection>
      </Row>
   )
}

Table.Body = Body
Table.Cell = TableCell
Table.Column = TableColumn
Table.Header = Header
Table.Row = TableRow

export { Table }
