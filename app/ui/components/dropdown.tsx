import { Icons } from "@/ui/components/icons"
import { cn, cr } from "@/ui/utils"
import { cva } from "class-variance-authority"
import {
   Collection,
   Header,
   ListBoxItem as ListBoxItemPrimitive,
   type ListBoxItemProps,
   Section,
   type SectionProps,
   Text,
   type TextProps,
} from "react-aria-components"

const dropdownItemVariants = cva(
   [
      "group relative flex h-[34px] cursor-default select-none items-center gap-x-1.5 rounded-[10px] px-2.5 py-2 text-base text-sm outline outline-0 [&_svg]:size-5 [&_svg]:text-popover-icon",
   ],
   {
      variants: {
         isDisabled: {
            false: "",
            true: "cursor-not-allowed opacity-70",
         },
         isFocused: {
            false: "",
            true: [
               "bg-popover-highlight shadow-[0px_1px_1px_1px_black]",
               "data-[danger=true]:bg-destructive data-[danger=true]:[&_svg]:text-destructive-foreground data-[danger=true]:text-destructive-foreground",
            ],
         },
      },
   },
)

type DropdownSectionProps<T> = SectionProps<T> & {
   title?: string
}

function DropdownSection<T extends object>({
   className,
   ...props
}: DropdownSectionProps<T>) {
   return (
      <Section className={cn("flex flex-col gap-y-0.5", className)}>
         {"title" in props && (
            <Header
               className={cn(
                  "-top-[5px] -mt-px -mb-0.5 -mx-1 sticky z-10 min-w-[--trigger-width] truncate border-y px-4 py-2 font-medium text-sm [&+*]:mt-1",
               )}
            >
               {props.title}
            </Header>
         )}
         <Collection items={props.items}>{props.children}</Collection>
      </Section>
   )
}

function DropdownItem({ className, ...props }: ListBoxItemProps) {
   const textValue =
      props.textValue ||
      (typeof props.children === "string" ? props.children : undefined)

   return (
      <ListBoxItemPrimitive
         textValue={textValue}
         className={cr(className, (className, renderProps) =>
            dropdownItemVariants({ ...renderProps, className }),
         )}
         {...props}
      >
         {cr(props.children, (children, { isSelected }) => (
            <>
               <span className="flex flex-1 items-center gap-2 truncate font-normal group-selected:font-medium">
                  {children}
               </span>

               {isSelected && (
                  <span className="absolute top-3 right-2 lg:top-2.5">
                     <Icons.check />
                  </span>
               )}
            </>
         ))}
      </ListBoxItemPrimitive>
   )
}

type DropdownItemSlot = TextProps & {
   label?: TextProps["children"]
   description?: TextProps["children"]
   classNames?: {
      label?: TextProps["className"]
      description?: TextProps["className"]
   }
}

function DropdownItemDetails({
   label,
   description,
   classNames,
   slot,
   children,
   title,
   ...props
}: DropdownItemSlot) {
   return (
      <div
         className="flex flex-col gap-1"
         {...props}
      >
         {label && (
            <Text
               slot={slot ?? "label"}
               className={cn("font-medium", classNames?.label)}
               {...props}
            >
               {label}
            </Text>
         )}
         {description && (
            <Text
               slot={slot ?? "description"}
               className={cn(
                  "text-foreground/70 text-xs",
                  classNames?.description,
               )}
               {...props}
            >
               {description}
            </Text>
         )}
         {!title && children}
      </div>
   )
}

export {
   DropdownItem,
   dropdownItemVariants,
   DropdownItemDetails,
   DropdownSection,
}
