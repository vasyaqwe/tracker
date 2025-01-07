import { createSelectors } from "@/misc/utils"
import { create } from "zustand"

type StoreState = {
   isRunning: boolean
}

const store = create<StoreState>()(() => ({
   isRunning: false,
}))

export const useTimerStore = createSelectors(store)
