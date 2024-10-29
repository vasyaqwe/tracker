import { Route as homeRoute } from "@/routes/$slug/_layout/index"
// import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuGroup,
//    DropdownMenuItem,
//    DropdownMenuLabel,
//    DropdownMenuSeparator,
//    DropdownMenuTrigger,
// } from "@/ui/components/dropdown-menu"
import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import { Link, useParams } from "@tanstack/react-router"

export function Sidebar() {
   const { slug } = useParams({ from: "/$slug/_layout" })
   // const navigate = useNavigate()
   //    const { project } = useAuth()

   //    const logoutFn = useServerFn(userFns.logout)
   //    const logout = useMutation({
   //       mutationFn: logoutFn,
   //       onSuccess: () => {
   //          navigate({ to: "/login" })
   //       },
   //    })

   // const projects = useSuspenseQuery(projectListQuery())

   return (
      <aside className="z-[10] h-svh w-[15.5rem] max-md:hidden">
         <div className="fixed flex h-full w-[15.5rem] flex-col border-border/60 border-r p-4 shadow-sm">
            {/* <div className="mb-3 flex items-center gap-px">
               <DropdownMenu>
                  <DropdownMenuTrigger
                     className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start whitespace-normal px-0 pl-0.5 font-semibold text-[0.975rem]",
                     )}
                  >
                     <Logo
                        className="size-[26px]"
                     />
                     <span className="mr-px line-clamp-1 break-all text-left">
                        {project.name}
                     </span>
                     <Icons.chevronDown className="mt-[2px] mr-1.5 ml-auto size-2 shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                     className="w-[199px]"
                     align="start"
                     title="Projects"
                  >
                     <DropdownMenuLabel>Projects</DropdownMenuLabel>
                     <DropdownMenuGroup className="max-h-[181px] overflow-y-auto pb-1">
                        {projects.data.map((p) => (
                           <DropdownMenuCheckboxItem
                              checked={p.id === project.id}
                              key={p.id}
                              onSelect={() =>
                                 navigate({
                                    to: `/${p.slug}`,
                                 })
                              }
                           >
                              <span className="line-clamp-1 break-all">
                                 {p.name}
                              </span>
                           </DropdownMenuCheckboxItem>
                        ))}
                     </DropdownMenuGroup>
                     <DropdownMenuSeparator className="mt-0" />
                     <DropdownMenuItem
                        onSelect={() => navigate({ to: "/new" })}
                     >
                        <Icons.plus /> New project
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div> */}
            <nav className="my-4 overflow-y-auto">
               <ul className="space-y-1">
                  <li>
                     <Link
                        params={{ slug }}
                        activeProps={{
                           className:
                              "!border-border/80 bg-elevated opacity-100",
                           "aria-current": "page",
                        }}
                        to={homeRoute.to}
                        className={cn(
                           "group flex h-10 items-center gap-2 rounded-[14px] border border-transparent px-2 font-semibold text-[0.95rem] leading-none opacity-75 transition-all hover:opacity-100",
                        )}
                     >
                        <Icons.inbox className="size-6" />
                        <span className="nav-link-text">Inbox</span>
                     </Link>
                  </li>
               </ul>
            </nav>
            <div className="mt-auto">
               {/* <svg
                           viewBox="0 0 24 24"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              d="M9 2C5.13401 2 2 5.13401 2 9V15C2 18.866 5.13401 22 9 22C10.7922 22 12.4291 21.3252 13.6669 20.2173C14.0784 19.849 14.1135 19.2168 13.7451 18.8053C13.3768 18.3938 12.7446 18.3588 12.3331 18.7271C11.4478 19.5194 10.2812 20 9 20C6.23858 20 4 17.7614 4 15V9C4 6.23858 6.23858 4 9 4C10.2812 4 11.4478 4.48059 12.3331 5.27292C12.7446 5.64125 13.3768 5.60623 13.7451 5.1947C14.1135 4.78317 14.0784 4.15098 13.6669 3.78265C12.4291 2.67482 10.7922 2 9 2Z"
                              fill="currentColor"
                           />
                           <path
                              d="M11.8065 9.10001C11.8462 8.70512 11.6486 8.32412 11.303 8.12908C10.9573 7.93404 10.529 7.96187 10.2115 8.2C9.15874 8.98959 8.208 9.90559 7.38045 10.9269C7.12735 11.2392 7 11.6199 7 12C7 12.3801 7.12736 12.7608 7.38045 13.0731C8.208 14.0944 9.15874 15.0104 10.2115 15.8C10.529 16.0381 10.9573 16.066 11.303 15.8709C11.6486 15.6759 11.8462 15.2949 11.8065 14.9C11.7756 14.592 11.7413 14.2989 11.7081 14.0156C11.6672 13.6656 11.628 13.3304 11.5989 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H11.5989C11.628 10.6696 11.6672 10.3344 11.7081 9.98449C11.7413 9.70113 11.7756 9.40803 11.8065 9.10001Z"
                              fill="currentColor"
                           />
                        </svg>
                        Log out */}
            </div>
         </div>
      </aside>
   )
}
