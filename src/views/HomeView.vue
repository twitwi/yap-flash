<script setup lang="ts">
import { useLocalStore, useMainStore } from '@/stores/simple'
import { Outcomes, type Outcome } from '@/typing'
import { computed, ref } from 'vue'

const local = useLocalStore()
const main = useMainStore()

const next = computed(() => {
  console.log(main.views)
  const i = Math.floor(Math.random() * main.cards.length)
  return {
    card: main.cards[i],
    upToDate: false, // whether there is no need to rehearse anymore
  }
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
  <div class="card-front" v-if="state === 'idle'">
    {{ next.card.front }}
    <br/>
    <button @click="state = 'flipped'">Flip</button>
  </div>
  <div class="card-back" v-else-if="state === 'flipped'">
    {{ next.card.back }}
    <br/>
    <button @click="state = 'idle'">(Flip Back)</button>
    <br/>
    <button v-for="feedback in Outcomes" :key="feedback" @click="registerFeedback(feedback)">{{ customText(feedback) }}</button>
  </div>
</template>

<style>
.card-front {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  font-size: 1.5em
}
</style>