<script lang="ts" setup>

import { APP_LOCAL_STORAGE_KEY } from '@/main-yjs';
import { computed } from 'vue'

const props = defineProps({
  k: {
    type: String,
    default: APP_LOCAL_STORAGE_KEY,
  },
  placeholder: {
    type: String,
    default: 'config::value',
  },
  mode: {
    type: String,
    default: 'raw',
  },
  summary: {
    type: String,
    default: 'Local storage (unfold to view/edit)',
  },
})


const lsvalue = computed({
  get: () => localStorage.getItem(props.k) ?? '',
  set: (value) => {
    localStorage.setItem(props.k, value);
  },
})
</script>
<template>
  <input v-if="mode === 'raw'" type="text" v-model="lsvalue" :placeholder="placeholder" />
  <details v-else-if="mode === 'details'">
    <summary>{{ summary }}</summary>
    <EditLocalStorageConfig style="width: 100%" />
  </details>
  <div v-else>Unknown mode {{ mode }}</div>

</template>
