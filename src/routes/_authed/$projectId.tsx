import { Add01Icon, Logout03Icon } from "@hugeicons/core-free-icons"
import {
   createFileRoute,
   Link,
   Navigate,
   Outlet,
   useNavigate,
} from "@tanstack/react-router"
import Avatar from "boring-avatars"
import { useMutation } from "convex/react"
import { useQuery } from "convex-helpers/react/cache"
import * as React from "react"
import tap from "@/assets/tap.wav"
import { authClient } from "@/auth/client"
import { useAuth } from "@/auth/hooks"
import { api } from "@/convex/_generated/api"
import { formatElapsed, today } from "@/date"
import { toastError } from "@/error"
import { ProjectContext, useProject } from "@/project/hooks"
import { Button } from "@/ui/components/button"
import { Icon } from "@/ui/components/icon"
import { Logo } from "@/ui/components/logo"
import { Menu } from "@/ui/components/menu"
import { cn } from "@/ui/utils"

export const Route = createFileRoute("/_authed/$projectId")({
   component: RouteComponent,
})

const AVATAR_COLORS = ["#5b1d99", "#0074b4", "#00b34c", "#ffd41f", "#fc6e3d"]

function RouteComponent() {
   const params = Route.useParams()
   const project = useQuery(api.project.byId, params)

   if (project === undefined)
      return (
         <main className="m-auto flex flex-col items-center gap-4">
            <Logo className="motion-opacity-in-0 motion-delay-100 size-9" />
            <p className="motion-opacity-in-0 motion-delay-500 text-muted">
               Workspace is loading...
            </p>
         </main>
      )
   if (project === null)
      return (
         <Navigate
            to="/"
            replace
         />
      )

   return (
      <ProjectContext value={project}>
         <div
            key={project._id}
            className="mx-auto w-full max-w-3xl items-start gap-9 px-4 pt-4 [--sidebar-height:340px] max-md:pb-8 md:flex md:pt-32"
         >
            <Navigation />
            <main className="relative flex min-h-(--sidebar-height) flex-1 flex-col md:pb-20">
               <Outlet />
            </main>
            <Stopwatch />
         </div>
      </ProjectContext>
   )
}

const tab =
   "relative flex items-center px-1 pb-3 font-[450] leading-none opacity-60 transition-opacity duration-100 before:absolute before:-bottom-px before:left-0 before:hidden before:h-[3px] before:w-full before:rounded-xs before:bg-foreground hover:opacity-100 aria-[current=page]:opacity-100 aria-[current=page]:before:block md:px-2 md:py-1 md:before:top-0.5 md:before:bottom-0.5 md:before:-left-1.5 md:before:h-auto md:before:w-0.5"

function Navigation() {
   const project = useProject()

   return (
      <div className="flex shrink-0 flex-col md:sticky md:top-9 md:h-(--sidebar-height) md:w-50">
         <div className="mb-6 flex items-center justify-between md:hidden">
            <Logo />
            <Menus className="justify-end" />
         </div>
         <nav className="max-md:mb-4">
            <Logo className="mb-6 -ml-0.75 max-md:hidden" />
            <ul className="relative items-center gap-3 pl-1 before:absolute before:-bottom-px before:h-0.5 before:w-[calc(100%+2rem)] before:rounded-xs before:bg-surface-4 max-md:flex max-md:before:-ml-5 md:space-y-2.5 md:before:top-0.5 md:before:-left-0.5 md:before:h-[calc(100%-4px)] md:before:w-0.5">
               <li>
                  <Link
                     to="/$projectId"
                     params={{ projectId: project._id }}
                     activeOptions={{ exact: true }}
                     className={tab}
                  >
                     Home
                  </Link>
               </li>
               <li>
                  <Link
                     to="/$projectId/settings"
                     params={{ projectId: project._id }}
                     className={tab}
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

function Menus({ className }: { className?: string }) {
   const project = useProject()
   const { user } = useAuth()
   const projects = useQuery(api.project.list)
   const navigate = useNavigate()

   return (
      <div className={cn("mt-auto flex items-center gap-3", className)}>
         <Menu.Root>
            <Menu.Trigger
               render={
                  <Button
                     variant="ghost"
                     kind="with-icon"
                     className="min-w-0 gap-1.5 pr-2 pl-1.5 text-sm!"
                  />
               }
            >
               <Avatar
                  name={project.name}
                  colors={AVATAR_COLORS}
                  className="size-5.5 shrink-0"
               />
               <span className="line-clamp-1 break-all">{project.name}</span>
               <Menu.TriggerIcon />
            </Menu.Trigger>
            <Menu.Popup align="start">
               <Menu.Group>
                  <Menu.GroupLabel>Projects</Menu.GroupLabel>
                  <Menu.RadioGroup
                     value={project._id}
                     onValueChange={(projectId) =>
                        navigate({ to: "/$projectId", params: { projectId } })
                     }
                     className="max-h-47 overflow-y-auto"
                  >
                     {(projects ?? []).map((item) => (
                        <Menu.RadioItem
                           key={item._id}
                           value={item._id}
                           closeOnClick
                        >
                           <Avatar
                              name={item.name}
                              colors={AVATAR_COLORS}
                              className="size-5 shrink-0"
                           />
                           <span className="line-clamp-1 break-all">
                              {item.name}
                           </span>
                        </Menu.RadioItem>
                     ))}
                  </Menu.RadioGroup>
               </Menu.Group>
               <Menu.Separator />
               <Menu.Item render={<Link to="/new" />}>
                  <Icon icon={Add01Icon} />
                  New project
               </Menu.Item>
            </Menu.Popup>
         </Menu.Root>
         <Menu.Root>
            <Menu.Trigger
               render={
                  <Button
                     variant="ghost"
                     kind="icon"
                     type="button"
                  />
               }
            >
               {user.image ? (
                  <img
                     src={user.image}
                     alt=""
                     className="size-5.5 rounded-full object-cover"
                  />
               ) : (
                  Array.from(user.name)[0]
               )}
            </Menu.Trigger>
            <Menu.Popup align="start">
               <Menu.Group>
                  <Menu.GroupLabel>
                     <span className="line-clamp-1 break-all">{user.name}</span>
                  </Menu.GroupLabel>
                  <Menu.Item
                     variant="destructive"
                     onClick={() =>
                        authClient.signOut().then(({ error }) => {
                           if (error) toastError(error)
                        })
                     }
                  >
                     <Icon icon={Logout03Icon} />
                     Log out
                  </Menu.Item>
               </Menu.Group>
            </Menu.Popup>
         </Menu.Root>
      </div>
   )
}

const playTap = () => new Audio(tap).play().catch(() => {})

function Stopwatch() {
   const project = useProject()
   const [now, setNow] = React.useState(Date.now)
   const running = project.timerStartedAt !== undefined

   const start = useMutation(api.timer.start).withOptimisticUpdate(
      (store, args) => {
         const current = store.getQuery(api.project.byId, args)
         if (current)
            store.setQuery(api.project.byId, args, {
               ...current,
               timerStartedAt: Date.now(),
            })
      },
   )
   const stop = useMutation(api.timer.stop).withOptimisticUpdate(
      (store, { projectId }) => {
         const current = store.getQuery(api.project.byId, { projectId })
         if (current)
            store.setQuery(
               api.project.byId,
               { projectId },
               { ...current, timerStartedAt: undefined },
            )
      },
   )

   const toggle = () => {
      playTap()
      if (running)
         return stop({ projectId: project._id, day: today() }).catch(toastError)
      setNow(Date.now())
      start({ projectId: project._id }).catch(toastError)
   }

   React.useEffect(() => {
      if (!running) return
      const interval = setInterval(() => setNow(Date.now()), 1000)
      return () => clearInterval(interval)
   }, [running])

   React.useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
         if (event.key !== "c" || event.metaKey || event.ctrlKey) return
         if (
            event.target instanceof HTMLElement &&
            event.target.closest("input, textarea, [contenteditable]")
         )
            return
         toggle()
      }
      window.addEventListener("keydown", onKeyDown)
      return () => window.removeEventListener("keydown", onKeyDown)
   })

   return (
      <div className="motion-translate-y-in-150 motion-duration-500 fixed inset-x-0 bottom-5 mx-auto flex w-fit items-center rounded-full bg-surface-12 py-1.25 pr-1.25 pl-5 text-white">
         <span className="mr-4 font-mono text-xl tabular-nums">
            {formatElapsed(
               running ? Math.max(0, now - (project.timerStartedAt ?? now)) : 0,
            )}
         </span>
         <Button
            size="xl"
            variant="ghost"
            aria-label={running ? "Stop session" : "Start session"}
            data-running={running ? "" : undefined}
            className="min-w-15 rounded-full bg-[#424242] text-white hover:bg-green-9/20 hover:text-green-8 data-running:hover:bg-red-9/20 data-running:hover:text-red-9"
            onClick={toggle}
         >
            {running ? "Stop" : "Start"}
         </Button>
      </div>
   )
}
