import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Card, View } from '@/typing'

export const useLocalStore = defineStore(
  'local',
  () => {
    // like setup() in a component
    //const userName = ref('bob')
    return { }
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
    const deletedCards = ref([] as Card[])
    return { views, cards, deletedCards }
  },
  {
    sharing: true, // shared through yjs (+ local IDB)
  },
)
