import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { BinaryBlob, Card, View } from '@/typing'

export const useLocalStore = defineStore(
  'local',
  () => {
    return {
      libNoSpoil: ref(true),
      libCompact: ref(false),
      manageTagsInSummary: ref(false),
      adaptiveTextAreas: ref(false),
    }
  },
  {
    persist: { key: 'yap-flash:local' }, // persisted in localStorage
  },
)

export const useMainStore = defineStore(
  'main',
  () => {
    // like setup() in a component
    const views = ref([] as View[])
    const cards = ref([] as Card[])
    const binaries = ref({} as Record<string, BinaryBlob>)
    const deletedCards = ref([] as Card[])
    return { views, cards, deletedCards, binaries }
  },
  {
    sharing: true, // shared through yjs (+ local IDB)
  },
)
