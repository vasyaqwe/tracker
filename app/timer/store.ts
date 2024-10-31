import { createSelectors } from "@/utils/misc"
import { create } from "zustand"

type StoreState = {
   isRunning: boolean
}

const store = create<StoreState>()(() => ({
   isRunning: false,
}))

export const useTimerStore = createSelectors(store)
