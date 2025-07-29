<script setup lang="ts">
defineProps<{
    tag: string
    noDelete?: boolean
}>()

const emit = defineEmits<{
    (e: 'delete', tag: string): void
}>()

</script>

<template>
    <span :class="{ tag: true, ['tag-'+tag]: true, 'no-delete': noDelete }">
        {{ tag }}
        <button v-if="!noDelete" @click="emit('delete', tag)">x</button>
    </span>
</template>

<style>
.tag {
  border: 1px solid #ccc;
  border-radius: .4rem;
  padding: 0 0 0 .4rem;
  &.no-delete {
    padding: 0 0.4em;
  }
  margin-right: .2rem;
  background: #333;
  color: white;
  cursor: pointer;
}
</style>