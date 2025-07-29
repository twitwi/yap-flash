<script setup lang="ts">
import { useLocalStore, useMainStore } from '@/stores/simple'
import type { Card, CardId, CardType } from '@/typing'
const local = useLocalStore()
const main = useMainStore()

function addCard() {
  const card = {
    id: (Date.now()+Math.random()).toString(36),
    type: 'basic' as CardType,
    front: 'Front',
    back: 'Back',
    tags: []
  }
  main.cards.push(card)
}

function promptDelete(cId: CardId) {
  const ind = main.cards.findIndex(card => card.id === cId)
  if (ind === -1) {
    alert('Card not found')
    return
  }
  if (confirm('Really delete Card?\n\nfront: '+main.cards[ind].front)) {
    const [c] = main.cards.splice(ind, 1)
    main.deletedCards.push(c)
  }
}

function promptAddTag(c: Card) {
  const tag = prompt('Add a new tag')
  if (tag) {
    if (!c.tags.includes(tag)) {
      c.tags.push(tag)
    }
  }
}
</script>

<template>
  <h3>Cards</h3>
  <div v-for="c in main.cards" :key="c.id" class="card-edit">
    <div class="id">{{ c.id }}</div>
    <div class="front">
      <textarea v-model="c.front"></textarea>
    </div>
    <div class="back">
      <textarea v-model="c.back"></textarea>
    </div>
    <div class="tags">
      Tags: 
      <span v-for="t in [...c.tags].sort()" :key="t" class="tag">{{ t }} <button @click="c.tags = c.tags.filter(tt => tt !== t)">x</button></span>
      <button @click="promptAddTag(c)">+</button>
    </div>
    <button @click="promptDelete(c.id)">Delete</button>
  </div>
  <button @click="addCard">+ Add Card</button>
</template>

<style>
.card-edit {
  border: 1px solid #ccc;
  margin: 1rem;
  padding: 1rem;
  border-radius: .5rem;

  position: relative;
  .id {
    font-weight: bold;
    position: absolute;
    top: -1rem;
    left: 1rem;
    background: white;
    padding: 0 .5rem;
  }
  .front, .back {
    left: 0;
    width: 100%;
    textarea {
      width: 100%;
    }
  }
  .back {
    left: 50%;
  }
}
.tag {
  border: 1px solid #ccc;
  border-radius: .4rem;
  padding: 0 0 0 .4rem;
  margin-right: .2rem;
  background: #333;
  color: white;
  cursor: pointer;
}

</style>