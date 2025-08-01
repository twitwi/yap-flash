<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import markdownit from 'markdown-it'
import { getObjectURL, getPersistentObjectURL } from '@/utils';
import { useMainStore } from '@/stores/simple';

const main = useMainStore()

const props = defineProps<{ content: string }>()
const md = new markdownit('commonmark', {})
const htmlContent = ref('')
function updateContent() {
  const content = props.content.replace(/bin:\/\/(.+)/g, (match, p1) => {
    const bblob = main.binaries[p1]
    if (bblob) {
      return `<img src="${getPersistentObjectURL(bblob)}" />`
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

