<script setup lang="ts">
import MDRender from '@/components/MDRender.vue'
import { useLocalStore, useMainStore } from '@/stores/simple'
import { Outcomes, type Outcome, type CardId, type Card } from '@/typing'
import { NButton, NSpace } from 'naive-ui'
import { computed, ref } from 'vue'

const local = useLocalStore()
const main = useMainStore()

// could move to the store
const dueDates = computed(() => {
  type Hist = {
    lastTime: number
    lastOutcome: Outcome
    okStreak: number
    due: number
  }
  const HOUR = 1000 * 3600
  const DAY = HOUR * 24
  const hrandom = () => (Math.random() - 0.5) * HOUR
  const res = new Map<CardId, Hist>()
  for (const v of main.views) {
    if (v.outcome === 'skip' || v.outcome === 'stop') {
      // TODO probably do something with skip
      // TODO consider stop as overtrivial
      continue
    }
    if (!res.has(v.cardId)) {
      res.set(v.cardId, { lastTime: 0, lastOutcome: 'wrong', okStreak: 0, due: 0 })
    }
    const hist = res.get(v.cardId)!
    if (['trivial', 'ok'].includes(v.outcome)) {
      hist.due = v.when + Math.pow(2, hist.okStreak) * (DAY + hrandom())
      hist.okStreak += 1
      if (v.outcome === 'trivial') {
        hist.okStreak += .25
      }
    } else {
      hist.okStreak = 0
      hist.due = v.when + Math.abs(hrandom()) / 60
    }
    hist.due = Math.round(hist.due)
    hist.lastTime = v.when
    hist.lastOutcome = v.outcome
  }
  for (const c of main.cards) {
    if (!res.has(c.id)) {
      res.set(c.id, { lastTime: 0, lastOutcome: 'wrong', okStreak: 0, due: hrandom() })
    }
  }
  return res
})

function minBy<T>(arr: Iterable<T>, f: (v: T) => number) {
  let minT = null
  let minF = null
  for (const v of arr) {
    if (minF === null) {
      minT = v
      minF = f(v)
    } else {
      const vf = f(v)
      if (vf < minF) {
        minT = v
        minF = vf
      }
    }
  }
  return minT as T
}

const DUMMY_CARD = {
  id: 'dummy',
  front: '',
  back: '',
  tags: [],
  type: 'basic',
} as Card

const next = computed(() => {
  if (dueDates.value.size == 0) {
    return { card: DUMMY_CARD }
  }
  const [id, hist] = minBy(dueDates.value.entries(), (e) => e[1].due)

  const card = main.cards.find(c => c.id === id)
  if (card === undefined) {
    return { card: DUMMY_CARD }
  }
  return { card, upToDate: hist.due >= Date.now() }

  /*
  const i = Math.floor(Math.random() * main.cards.length)
  return {
    card: main.cards[i],
    upToDate: false, // whether there is no need to rehearse anymore
  }*/
})

function registerFeedback(outcome: Outcome) {
  main.views.push({
    cardId: next.value.card.id,
    outcome,
    when: Date.now(),
  })
  state.value = 'idle'
}

type State = 'idle' | 'flipped'
const state = ref<State>('idle')

function customText(outcome: Outcome): string {
  switch (outcome) {
    case 'ok':
      return '[[[ OK ]]]'
    case 'wrong':
      return '[[[ WRONG ]]]'
    default:
      return outcome
  }
}
</script>

<template>
  <div v-if="next.upToDate" style="text-align: center;">You're up to date, you can still practice if you want.</div>
  <div class="card-front" v-if="next.card && state === 'idle'">
    <NSpace style="width: 100% ;" justify="space-between">
      <NButton @click="state = 'flipped'" type="primary">Flip</NButton>
      <NButton @click="registerFeedback('skip')">Skip</NButton>
    </NSpace>
    <div class="card-content">
      <MDRender :content="next.card.front"></MDRender>
    </div>
    <NSpace justify="space-around">
      <NButton @click="registerFeedback('skip')">Skip</NButton>
      <NButton @click="state = 'flipped'" type="primary">Flip</NButton>
    </NSpace>
  </div>
  <div class="card-back" v-else-if="next.card && state === 'flipped'">
    <NSpace style="width: 100% ;" justify="space-between">
      <NButton @click="state = 'idle'">Flip back</NButton>
      <NButton @click="state = 'idle'">Flip back</NButton>
    </NSpace>
    <div class="card-content">
      <MDRender :content="next.card.back"></MDRender>
    </div>
    <NSpace justify="space-around">
      <NButton v-for="feedback in Outcomes" :key="feedback" type="info" @click="registerFeedback(feedback)">{{ customText(feedback) }}</NButton>
    </NSpace>
  </div>
</template>

<style>
.card-front, .card-back {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  background-color: #e0f0e0;
  padding: 20px;
  border-radius: 8px;
  font-size: 1.5em;
  .card-content {
    border: 3px solid darkgreen;
    background: #eeffee;
    border-radius: 1em;
    padding: 2em;
  }
}
.card-back {
  background-color: #d0d0f0;
  .card-content {
    border-color: darkblue;
    background: #eeeeff;
  }
}
</style>
