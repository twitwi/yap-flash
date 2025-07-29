<script setup lang="ts">
import CardEditor from '@/components/CardEditor.vue'
import TagTag from '@/components/TagTag.vue'
import { useLocalStore, useMainStore } from '@/stores/simple'
import type { CardId, CardType } from '@/typing'
import { promptAddTag, removeTag, sorted } from '@/utils'

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

</script>

<template>
  <h3>Cards</h3>
  <div class="controls">
    <label title="Prevent spoiler?"><input type="checkbox" v-model="local.libNoSpoil"> NoSpoil</label>
    <label title="Foldable compact view?"><input type="checkbox" v-model="local.libCompact"> Compact</label>
    <label title="Manage tags in summary?"><input type="checkbox" v-model="local.manageTagsInSummary"> xTags</label>
  </div>
  <div :class="{ noSpoiler: local.libNoSpoil, displaynone: true }"></div>
  <template v-if="local.libCompact">
    <details v-for="c in main.cards" :key="c.id">
      <summary>
        {{ c.front }} <TagTag v-for="t in sorted(c.tags)" :key="t" :tag="t" :noDelete="!local.manageTagsInSummary" @delete="removeTag(c, t)" />
        <button v-if="local.manageTagsInSummary" @click="promptAddTag(c)">+</button>
      </summary>
      <CardEditor :card="c" class="card-edit" @delete="promptDelete"></CardEditor>
    </details>
  </template>
  <template v-else v-for="c in main.cards" :key="c.id">
    <CardEditor :card="c" class="card-edit" @delete="promptDelete"></CardEditor>
  </template>
  <button @click="addCard">+ Add Card</button>
</template>

<style>
.controls label {
  margin-left: 2rem;
}
.displaynone {
  display: none;
}
.noSpoiler ~ * .back {
  border: 1px dashed orange;
  background: #eeeeee;

  & textarea:not(:focus) {
    opacity: 0;
  }
}
.delete {
  float: right;
  position: relative;
  top: -1rem;
}

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

</style>