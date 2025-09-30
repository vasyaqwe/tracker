import app from "@/assets/app.webp"
import app_mobile from "@/assets/app_mobile.webp"
import logo from "@/assets/logo.png"
import { projectListQuery } from "@/project/queries"
import { buttonVariants } from "@/ui/components/button"
import { Card } from "@/ui/components/card"
import { Logo } from "@/ui/components/logo"
import { cn } from "@/ui/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
   loader: async ({ context }) => {
      await context.queryClient.ensureQueryData(projectListQuery()).catch()
   },
   component: Component,
   errorComponent: Homepage,
})

function Component() {
   const projects = useSuspenseQuery(projectListQuery())

   return (
      <Homepage
         isAuthed
         projects={projects.data}
      />
   )
}

function Homepage({
   projects = [],
   isAuthed = false,
}: { projects?: { slug: string }[]; isAuthed?: boolean }) {
   return (
      <div className="max-h-svh w-full overflow-y-auto">
         <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 pt-5">
            <Link
               to="/"
               className="flex items-center gap-3 font-medium font-secondary text-[1.725rem] tracking-tight"
            >
               <Logo className="size-8" />
            </Link>
            {!isAuthed ? (
               <Link
                  to="/login"
                  className={cn(buttonVariants({ intent: "outline" }))}
               >
                  Log in
               </Link>
            ) : (
               <Link
                  to={projects.length === 0 ? "/new" : `/$slug`}
                  params={{ slug: projects[0]?.slug }}
                  className={cn(buttonVariants({ intent: "outline" }))}
               >
                  Open app
               </Link>
            )}
         </header>
         <main className="mt-8 md:mt-16">
            <section className="mx-auto max-w-4xl px-4">
               <h1 className="font-medium text-4xl">A tiny time tracker</h1>
               <p className="mt-5 font-medium text-foreground/70 text-lg">
                  Simple & efficient time tracking app. <br /> Create projects,
                  track earnings & hours.
               </p>
               <Link
                  to={
                     !isAuthed
                        ? "/login"
                        : projects.length === 0
                          ? "/new"
                          : `/$slug`
                  }
                  params={{ slug: projects[0]?.slug }}
                  className={cn(buttonVariants(), "mt-5 min-w-[70px]")}
               >
                  Try it
               </Link>
            </section>
            <section className="relative mx-auto mt-12 max-w-4xl px-4 md:mt-20">
               <Card className="rounded-none rounded-t-[20px] p-1.5 pb-0">
                  <picture>
                     <source
                        srcSet={app_mobile}
                        media="(max-width: 768px)"
                     />
                     <img
                        className="-mb-px md:-mb-[2px] mx-auto w-full rounded-t-[calc(20px-3px)] border border-border max-md:max-w-[400px]"
                        src={app}
                        alt="App screenshot"
                     />
                  </picture>
               </Card>
            </section>
         </main>
         <footer className="relative z-[2] border-border/75 border-t bg-background py-8 shadow-md md:py-12">
            <div className="mx-auto flex max-w-4xl flex-col justify-between gap-6 px-4 sm:flex-row">
               <div>
                  <Link
                     to="/"
                     className="flex items-center gap-3 font-medium text-[1.725rem] tracking-tight"
                  >
                     <img
                        src={logo}
                        className="max-w-28"
                        alt="Tracker"
                     />
                  </Link>
                  <p className="mt-6 text-foreground/75 text-sm transition-colors hover:text-foreground">
                     Tracker is fully open-source.{" "}
                     <a
                        href="https://github.com/vasyaqwe/tracker"
                        target="_blank"
                        rel="noreferrer"
                     >
                        <u>View it on Github</u>
                     </a>
                  </p>
               </div>
               <small className="mt-auto inline-block text-foreground/75 text-sm ">
                  {`© ${new Date().getFullYear()} Tracker. All rights reserved.`}
               </small>
            </div>
         </footer>
      </div>
   )
}
