<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import markdownit from 'markdown-it'
import { getPersistentObjectURL } from '@/utils';
import { useMainStore } from '@/stores/simple';

const main = useMainStore()

const props = defineProps<{ content: string }>()
const md = new markdownit('commonmark', {})
const htmlContent = ref('')
function updateContent() {
  const content = props.content.replace(/(?<!\w)img:\/\/([-a-z0-9]+)(([.][^.\s]+)*)/g, (match, p1, p2) => {
    const bblob = main.binaries.find(blob => blob.id === p1)
    if (bblob) {
      return `<img src="${getPersistentObjectURL(bblob)}" class="${p2 ? p2.replace(/[.]/g, ' ').trim() : ''}" />`
    } else {
      return `(((missing binary ${p1})))`
    }
  }).replace(/(?<!\w)bin:\/\/([-a-z0-9]+)/g, (match, p1) => {
    const bblob = main.binaries.find(blob => blob.id === p1)
    if (bblob) {
      return getPersistentObjectURL(bblob)
    } else {
      return `(((missing binary ${p1})))`
    }
  })
  htmlContent.value = md.render(content)
}
onMounted(updateContent)
watch(() => props.content, updateContent)
</script>

<template>
  <div v-html="htmlContent"></div>
</template>

