<script setup lang="ts">
import type { Card, CardId } from '@/typing';
import { computed } from 'vue';
import TagTag from './TagTag.vue';
import { promptAddTag, removeTag, sorted } from '@/utils';

const props = defineProps<{
    card: Card
    adaptive?: boolean
}>()
const card = computed(() => props.card) // kind of hide the mutation, it is intentional that this Editor mutates the props directly.

const emit = defineEmits<{
  (e: 'delete', id: CardId): void
}>()
</script>

<template>
  <div class="card-edit">
    <div class="id">{{ card.id }}</div>
    <div class="front">
      <textarea v-model="card.front" :rows="adaptive ? 2 + card.front.replace(/[^\n]/g, '').length : 2"></textarea>
    </div>
    <div class="back">
      <textarea v-model="card.back" :rows="adaptive ? 2 + card.back.replace(/[^\n]/g, '').length : 2"></textarea>
    </div>
    <div class="tags">
      Tags:
      <TagTag v-for="t in sorted(card.tags)" :key="t" :tag="t" @delete="removeTag(card, t)" />
      <button @click="promptAddTag(card)">+</button>
    </div>
    <button class="delete" @click="emit('delete', card.id)">Delete</button>
  </div>
</template>

