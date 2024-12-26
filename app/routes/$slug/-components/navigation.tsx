import { projectListQuery } from "@/project/queries"
import { Route as homeRoute } from "@/routes/$slug/_layout/index"
import { Route as settingsRoute } from "@/routes/$slug/_layout/settings"
import { useTimerStore } from "@/timer/store"
import { buttonVariants } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { Logo } from "@/ui/components/logo"
import { Menu } from "@/ui/components/menu"
import { useIsClient } from "@/ui/hooks/use-is-client"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
import * as userFns from "@/user/functions"
import { useAuth } from "@/user/hooks"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import Avatar from "boring-avatars"
import type { ComponentProps } from "react"

export function Navigation() {
   const { slug } = useParams({ from: "/$slug/_layout" })

   return (
      <div className="flex shrink-0 flex-col md:sticky md:top-9 md:h-[var(--sidebar-height)] md:w-56">
         <div className="mb-6 flex items-center justify-between md:hidden">
            <Logo className="size-8" />
            <Menus className="justify-end" />
         </div>
         <nav className="max-md:mb-4">
            <Logo className="-ml-[3px] mb-6 size-8 max-md:hidden" />
            <ul className="md:before:-left-[2px] max-md:before:-ml-5 before:-bottom-[1px] relative items-center gap-3 pl-1 [--padding-block:4px] before:absolute md:before:top-[2px] max-md:flex before:h-[2px] md:before:h-[calc(100%-var(--padding-block))] before:w-[calc(100%+2rem)] md:before:w-[2px] md:space-y-2.5 before:rounded-xs before:bg-border">
               <li>
                  <Link
                     preload={"render"}
                     params={{ slug }}
                     activeProps={{
                        className:
                           "opacity-100 before:block md:before:top-[calc(var(--padding-block)/2)] before:-bottom-[1px]",
                     }}
                     activeOptions={{
                        exact: true,
                     }}
                     inactiveProps={{
                        className: "opacity-60 before:hidden",
                     }}
                     to={homeRoute.to}
                     className={cn(
                        "group md:before:-left-[6px] relative flex items-center gap-2 px-1 font-medium leading-none transition-opacity duration-100 before:absolute before:left-0 before:h-[3px] md:before:h-[calc(100%-var(--padding-block))] before:w-full md:before:w-[2px] before:rounded-xs before:bg-foreground md:px-2 md:py-1 max-md:pb-3 hover:opacity-100",
                     )}
                  >
                     Home
                  </Link>
               </li>
               <li>
                  <Link
                     preload={"render"}
                     params={{ slug }}
                     activeProps={{
                        className:
                           "opacity-100 before:block md:before:bottom-[calc(var(--padding-block)/2)] before:-bottom-[1px]",
                     }}
                     inactiveProps={{
                        className: "opacity-60 before:hidden",
                     }}
                     to={settingsRoute.to}
                     className={cn(
                        "group md:before:-left-[6px] relative flex items-center gap-2 px-1 font-medium leading-none transition-opacity duration-100 before:absolute before:left-0 before:h-[3px] md:before:h-[calc(100%-var(--padding-block))] before:w-full md:before:w-[2px] before:rounded-xs before:bg-foreground md:px-2 md:py-1 max-md:pb-3 hover:opacity-100",
                     )}
                  >
                     Settings
                  </Link>
               </li>
            </ul>
         </nav>
         <Menus className="justify-between max-md:hidden" />
      </div>
   )
}

function Menus({ className, ...props }: ComponentProps<"div">) {
   const { slug } = useParams({ from: "/$slug/_layout" })
   const navigate = useNavigate()
   const { project, user } = useAuth()

   const projects = useSuspenseQuery(projectListQuery())

   const logoutFn = useServerFn(userFns.logout)
   const logout = useMutation({
      mutationFn: logoutFn,
      onSuccess: () => {
         navigate({ to: "/login" })
      },
   })

   const isMobile = useUIStore().isMobile

   const { isClient } = useIsClient()

   const isRunning = useTimerStore().isRunning

   return (
      <div
         className={cn("mt-auto flex items-center gap-3", className)}
         {...props}
      >
         <Menu respectScreen={false}>
            <Menu.Trigger
               className={cn(
                  buttonVariants({ intent: "ghost" }),
                  "justify-start gap-1.5 pr-[2px] pl-[5px] text-left font-medium",
               )}
            >
               {isClient ? (
                  <Avatar
                     name={project.id}
                     className="size-[22px] shrink-0 animate-fade-in opacity-0"
                  />
               ) : (
                  <div className="size-[22px] shrink-0" />
               )}
               <span className="line-clamp-1 break-all">{project.name}</span>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="size-4 shrink-0 opacity-80"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
               </svg>
            </Menu.Trigger>
            <Menu.Content
               placement={!isMobile ? "bottom left" : "bottom right"}
            >
               <Menu.Header>Projects</Menu.Header>
               <Menu.Section className="max-h-[188px] overflow-y-auto">
                  {projects.data.map((project) => (
                     <Menu.Checkbox
                        isDisabled={isRunning}
                        onAction={() =>
                           navigate({
                              to: "/$slug",
                              params: { slug: project.slug },
                           })
                        }
                        key={project.id}
                        isSelected={slug === project.slug}
                     >
                        {isClient ? (
                           <Avatar
                              name={project.id}
                              className="size-6 shrink-0"
                           />
                        ) : (
                           <div className="size-6 shrink-0" />
                        )}
                        <span className="line-clamp-1 break-all">
                           {project.name}
                        </span>
                     </Menu.Checkbox>
                  ))}
               </Menu.Section>
               <Menu.Separator />
               <Menu.Item
                  isDisabled={isRunning}
                  onAction={() => navigate({ to: "/new" })}
               >
                  <Icons.plus />
                  New project
               </Menu.Item>
            </Menu.Content>
         </Menu>
         <Menu respectScreen={false}>
            <Menu.Trigger
               className={cn(
                  buttonVariants({ intent: "outline", size: "icon" }),
                  "shrink-0 rounded-full font-medium uppercase",
                  user.avatarUrl
                     ? "!px-0 !border-none size-7 transition-opacity duration-200 aria-expanded:opacity-80 hover:opacity-80"
                     : "",
               )}
            >
               {user.avatarUrl ? (
                  <img
                     className="size-full rounded-full object-cover"
                     src={user.avatarUrl}
                     alt=""
                  />
               ) : (
                  Array.from(user.name)[0]
               )}
            </Menu.Trigger>
            <Menu.Content
               placement={!isMobile ? "bottom left" : "bottom right"}
            >
               <Menu.Header>
                  <span className="line-clamp-1 break-all">{user.name}</span>
               </Menu.Header>
               <Menu.Item
                  isDisabled={isRunning}
                  isDanger
                  onAction={() => logout.mutate({})}
               >
                  <svg
                     className="size-5 opacity-75"
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
                  Log out
               </Menu.Item>
            </Menu.Content>
         </Menu>
      </div>
   )
}
