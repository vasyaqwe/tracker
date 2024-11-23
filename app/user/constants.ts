import type { CookieSerializeOptions } from "vinxi/http"

export const COOKIE_OPTIONS = {
   path: "/",
   secure: import.meta.env.MODE === "production",
   httpOnly: true,
   maxAge: 60 * 10,
   sameSite: "lax",
} satisfies CookieSerializeOptions
