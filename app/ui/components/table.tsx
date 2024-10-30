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
   "table w-full border-spacing-0 text-sm outline-none [&_[data-drop-target]]:border [&_[data-drop-target]]:border-primary",
)
const header = cn("border-border border-b")
const row = cn(
   "tr group relative cursor-default border-border border-b outline-none ring-primary data-[selected=true]:bg-elevated/60 focus-visible:ring-1",
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
      <div className="relative w-full overflow-auto">
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
      className={cn("[&_.tr:last-child]:border-0")}
   />
)

type TableCellProps = CellProps & {
   className?: string
}

const cellVariants = cva("group whitespace-nowrap px-3 py-3 outline-none", {
   variants: {
      allowResize: {
         true: "overflow-hidden truncate",
      },
   },
})
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
   "relative whitespace-nowrap px-3 py-3 text-left font-medium outline-none allows-sorting:cursor-pointer dragging:cursor-grabbing [&:has([slot=selection])]:pr-0",
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
                        <span
                           className={cn(isHovered ? "bg-secondary-fg/10" : "")}
                        >
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
            "href" in props
               ? cn("cursor-pointer hover:bg-secondary/50", className)
               : "",
         )}
      >
         {selectionBehavior === "toggle" && (
            <Cell className="pl-4">
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
