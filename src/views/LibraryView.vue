<script setup lang="ts">
import CardEditor from '@/components/CardEditor.vue'
import TagTag from '@/components/TagTag.vue'
import { useLocalStore, useMainStore } from '@/stores/simple'
import type { CardId, CardType } from '@/typing'
import { getPersistentObjectURL, newCardId, promptAddTag, removeTag, simpleFourColorBBlob, sorted } from '@/utils'
import { NButton } from 'naive-ui'

const local = useLocalStore()
const main = useMainStore()


function addCard() {
  const card = {
    id: newCardId(),
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

function resetBinaries() {
  main.binaries.splice(0, main.binaries.length, simpleFourColorBBlob())
}

function promptDeleteBinary(bId: string) {
  const ind = main.binaries.findIndex(bin => bin.id === bId)
  if (ind === -1) {
    alert('Binary not found')
    return
  }
  if (confirm('Really delete Binary?\n\nid: '+bId)) {
    const [b] =main.binaries.splice(ind, 1)
    main.deletedBinaries.push(b)
  }
}

async function copyContent(element: HTMLElement | null) {
  if (element?.textContent) {
    await navigator.clipboard.writeText(element.textContent)
    element.classList.add('copied')
    setTimeout(() => element.classList.remove('copied'), 500)
  }
}

</script>

<template>
  <h3>Cards</h3>
  <div class="controls">
    <label title="Prevent spoiler?"><input type="checkbox" v-model="local.libNoSpoil"> NoSpoil</label>
    <label title="Foldable compact view?"><input type="checkbox" v-model="local.libCompact"> Compact</label>
    <label title="Manage tags in summary?"><input type="checkbox" v-model="local.manageTagsInSummary"> xTags</label>
    <label title="Bigger textareas?"><input type="checkbox" v-model="local.adaptiveTextAreas"> ⇕ adapt</label>
  </div>
  <div :class="{ noSpoiler: local.libNoSpoil, displaynone: true }"></div>
  <template v-if="local.libCompact">
    <details v-for="c in main.cards" :key="c.id">
      <summary>
        {{ c.front }} <TagTag v-for="t in sorted(c.tags)" :key="t" :tag="t" :noDelete="!local.manageTagsInSummary" @delete="removeTag(c, t)" />
        <button v-if="local.manageTagsInSummary" @click="promptAddTag(c)">+</button>
      </summary>
      <CardEditor :card="c" class="card-edit" @delete="promptDelete" :adaptive="local.adaptiveTextAreas"></CardEditor>
    </details>
  </template>
  <template v-else v-for="c in main.cards" :key="c.id">
    <CardEditor :card="c" class="card-edit" @delete="promptDelete" :adaptive="local.adaptiveTextAreas"></CardEditor>
  </template>
  <button @click="addCard">+ Add Card</button>
  <h3>Binaries ({{ Object.keys(main.binaries).length }})</h3>
  <div class="binary-controls">
    <button @click="resetBinaries()">Reset to empty</button>
    <NButton @click="$router.push('import-image')">Add</NButton>
  </div>
  <div class="binaries">
    <div v-for="b in main.binaries" :key="b.id">
      <code @click="ev => copyContent(ev.target as HTMLElement)">img://{{ b.id }}</code>
      <span> </span>
      <img :src="getPersistentObjectURL(b)" @click="ev => copyContent((ev.target as HTMLElement)!.parentElement!.querySelector('code'))" />
      <NButton type="error" @click="promptDeleteBinary(b.id)">Delete</NButton>
    </div>
  </div>
  <div class="binary-use">

  </div>
</template>

<style>
.copied {
  background: #BFB;
}
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
