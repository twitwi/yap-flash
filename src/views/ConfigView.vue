<script setup lang="ts">
import EditLocalStorageConfig from '@/components/EditLocalStorageConfig.vue';
import { yjs } from '@/main';

import { useMainStore } from '@/stores/stores'; // to ensure preloading for other tabs...
useMainStore()

function promptReloadPage() {
  if (confirm('Are you sure you want to reload the page?')) {
    location.reload()
  }
}

function prompt(act: CallableFunction, what="Are you sure?") {
  if (confirm(what)) {
    act()
  }
}

function deleteLocalYdoc() {
  yjs.idb?.clearData()
  location.reload()
}
</script>

<template>
  <h3>Config</h3>
  <details>
    <summary>local storage (security: hidden)</summary>
    <EditLocalStorageConfig style="width: 100%" />
  </details>
  <details>
    <summary>Advanced</summary>
    <button @click="promptReloadPage()">Reload</button>
    <h3>Use at your own risks</h3>
    <button @click="prompt(deleteLocalYdoc)">delete local ydoc</button>
  </details>
</template>
