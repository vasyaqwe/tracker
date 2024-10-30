import logo from "@/assets/icon.png"
import { projectListQuery } from "@/project/queries"
import { Route as homeRoute } from "@/routes/$slug/_layout/index"
import { Route as settingsRoute } from "@/routes/$slug/_layout/settings"
import { Button, buttonVariants } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { Menu } from "@/ui/components/menu"
import { cn } from "@/ui/utils"
import * as userFns from "@/user/functions"
import { useAuth } from "@/user/hooks"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"

export function Sidebar() {
   const { slug } = useParams({ from: "/$slug/_layout" })
   const navigate = useNavigate()
   const { user } = useAuth()

   const logoutFn = useServerFn(userFns.logout)
   const logout = useMutation({
      mutationFn: logoutFn,
      onSuccess: () => {
         navigate({ to: "/login" })
      },
   })

   const projects = useSuspenseQuery(projectListQuery())

   return (
      <aside className="sticky top-7 flex h-[375px] w-48 flex-col max-md:hidden">
         <nav>
            <img
               src={logo}
               className="-ml-[3px] mb-6 size-8"
               alt="Tracker"
            />
            <ul className="before:-left-[2px] before:-top-[var(--block)] relative space-y-1 pl-1 [--block:2px] before:absolute before:h-[calc(100%+calc(var(--block)*2))] before:w-[2px] before:bg-border">
               <li>
                  <Link
                     params={{ slug }}
                     activeProps={{
                        className:
                           "opacity-100 before:block before:-top-[var(--block)]",
                        "aria-current": "page",
                     }}
                     activeOptions={{
                        exact: true,
                     }}
                     inactiveProps={{
                        className: "opacity-60 before:hidden",
                     }}
                     to={homeRoute.to}
                     className={cn(
                        "group before:-left-[6px] relative flex items-center gap-2 px-2 pb-2 font-medium leading-none before:absolute before:h-5 before:w-[2px] before:rounded-sm before:bg-foreground hover:opacity-100",
                     )}
                  >
                     Home
                  </Link>
               </li>
               <li>
                  <Link
                     params={{ slug }}
                     activeProps={{
                        className:
                           "opacity-100 before:block before:-bottom-[var(--block)]",
                        "aria-current": "page",
                     }}
                     inactiveProps={{
                        className: "opacity-60 before:hidden",
                     }}
                     to={settingsRoute.to}
                     className={cn(
                        "group before:-left-[6px] relative flex items-center gap-2 px-2 pt-2 font-medium leading-none before:absolute before:h-5 before:w-[2px] before:rounded-sm before:bg-foreground hover:opacity-100",
                     )}
                  >
                     Settings
                  </Link>
               </li>
            </ul>
         </nav>
         <div className="mt-auto flex items-center gap-3">
            <Menu>
               <Menu.Trigger
                  className={cn(
                     buttonVariants({ intent: "ghost" }),
                     "block justify-start truncate break-all text-left font-medium",
                  )}
               >
                  {user.name}
               </Menu.Trigger>
               <Menu.Content placement="top">
                  <Menu.Header>Projects</Menu.Header>
                  {projects.data.map((project) => (
                     <Menu.Checkbox
                        onAction={() =>
                           navigate({
                              to: "/$slug",
                              params: { slug: project.slug },
                           })
                        }
                        key={project.id}
                        isSelected={slug === project.slug}
                     >
                        {project.name}
                     </Menu.Checkbox>
                  ))}
                  <Menu.Separator />
                  <Menu.Item onAction={() => navigate({ to: "/new" })}>
                     <Icons.plus />
                     New project
                  </Menu.Item>
               </Menu.Content>
            </Menu>
            <Button
               intent={"ghost"}
               size={"icon"}
               aria-label="Log out"
               onPress={() => logout.mutate()}
               className={"ml-auto shrink-0"}
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
            </Button>
         </div>
      </aside>
   )
}
