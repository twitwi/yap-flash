<script setup lang="ts">
import EditLocalStorageConfig from '@/components/EditLocalStorageConfig.vue';

import { useMainStore } from '@/stores/simple'; // to ensure preloading for other tabs...
useMainStore()

function promptReloadPage() {
  if (confirm('Are you sure you want to reload the page?')) {
    location.reload()
  }
}
</script>

<template>
  <h3>Config</h3>
  <details>
    <summary>local storage (security: hidden)</summary>
    <EditLocalStorageConfig style="width: 100%" />
  </details>
  <h3>More</h3>
  <button @click="promptReloadPage()">Reload</button>
</template>
