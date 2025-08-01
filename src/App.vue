<script setup lang="ts">
import { RouterView } from 'vue-router'
import ReloadPrompt from './components/ReloadPrompt.vue'
import { NButton, NButtonGroup, NConfigProvider } from 'naive-ui'
import { bindRouterLink, getTheme } from './main-naiveui'

const color = import.meta.env.VITE_THEME_HEXCOLOR
const theme = getTheme(color)

</script>

<template>
  <NConfigProvider :theme-overrides="theme">
    <header>
      <nav>
        <NButtonGroup class="header">
          <NButton v-bind="bindRouterLink('home')">Home</NButton>
          <NButton v-bind="bindRouterLink('library')">Library</NButton>
          <NButton v-bind="bindRouterLink('config')" style="flex: 0">cfg</NButton>
        </NButtonGroup>
      </nav>
    </header>

    <RouterView />
  </NConfigProvider>
  <ReloadPrompt />
</template>

<style>
.header {
  width: 100%;
  display: flex;
  & > * {
    flex: 1;
  }
}
</style>
