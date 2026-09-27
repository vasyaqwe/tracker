import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getColorFromId = (id: string): string => {
   const AVATAR_COLORS = [
      "bg-indigo-100 text-indigo-900",
      "bg-violet-100 text-violet-900",
      "bg-pink-100 text-pink-900",
      "bg-rose-100 text-rose-900",
      "bg-amber-100 text-amber-900",
      "bg-emerald-100 text-emerald-900",
      "bg-teal-100 text-teal-900",
      "bg-cyan-100 text-cyan-900",
      "bg-blue-100 text-blue-900",
      "bg-purple-100 text-purple-900",
   ]

   if (id === "") return "bg-surface-9"
   const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
   return AVATAR_COLORS[hash % AVATAR_COLORS.length] ?? ""
}
