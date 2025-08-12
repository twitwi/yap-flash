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
      imageType: ref('webp'),
      imageQuality: ref(80),
      bigPreview: ref(false),
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
    return {
      views: ref([] as View[]),
      cards: ref([] as Card[]),
      deletedCards: ref([] as Card[]),
      binaries: ref([] as BinaryBlob[]),
      deletedBinaries: ref([] as BinaryBlob[]),
    }
  },
  {
    sharing: true, // shared through yjs (+ local IDB)
  },
)
