<script setup lang="ts">
import MDRender from '@/components/MDRender.vue'
import { useLocalStore, useMainStore } from '@/stores/simple'
import { Outcomes, type Outcome } from '@/typing'
import { NButton, NButtonGroup, NSpace } from 'naive-ui'
import { computed, ref } from 'vue'

const local = useLocalStore()
const main = useMainStore()

const next = computed(() => {
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
  <div class="card-front" v-if="next.card && state === 'idle'">
    <NSpace style="width: 100;" justify="space-around">
      <NButton @click="registerFeedback('skip')">Skip</NButton>
      <NButton @click="state = 'flipped'" type="primary">Flip</NButton>
    </NSpace>
    <div class="card-content">
      <MDRender :content="next.card.front"></MDRender>
    </div>
    <br/>
    <NSpace style="width: 100;" justify="space-around">
      <NButton @click="state = 'flipped'" type="primary">Flip</NButton>
      <NButton @click="registerFeedback('skip')">Skip</NButton>
    </NSpace>
  </div>
  <div class="card-back" v-else-if="next.card && state === 'flipped'">
    <button @click="state = 'idle'">(Flip Back)</button>
    <div class="card-content">
      <MDRender :content="next.card.back"></MDRender>
    </div>
    <br/>
    <NSpace>
      <NButton v-for="feedback in Outcomes" :key="feedback" type="info" @click="registerFeedback(feedback)">{{ customText(feedback) }}</NButton>
    </NSpace>
  </div>
</template>

<style>
.card-front, .card-back {
  background-color: #e0f0e0;
  padding: 20px;
  border-radius: 8px;
  font-size: 1.5em
}
.card-back {
  background-color: #d0d0f0;
}
</style>
