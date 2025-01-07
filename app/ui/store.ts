import { createSelectors } from "@/misc/utils"
import { create } from "zustand"

type StoreState = {
   isMobile: boolean
}

const store = create<StoreState>()(() => ({
   isMobile: true,
}))

export const useUIStore = createSelectors(store)
