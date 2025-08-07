<script setup lang="ts">
import { NButton, NCard, NInput, NInputNumber, NSelect } from 'naive-ui'
import { reactive, ref } from 'vue'
import VuePictureCropper, { cropper } from 'vue-picture-cropper'

import { useLocalStore, useMainStore } from '@/stores/simple'
import { bytesToBase64, copyContent, newBinaryId } from '@/utils'
import { computedAsync } from '@vueuse/core'

const main = useMainStore()
const local = useLocalStore()

const showCropper = ref<boolean>(false)
const pic = ref<string>('')

function handleClipboardItems(items: ClipboardItem[]) {
  for (const item of items) {
    if (item.types.includes('image/png')) {
      item.getType('image/png').then((blob) => {
        const url = URL.createObjectURL(blob)
        pic.value = url
        showCropper.value = true
      })
    }
  }
}
function pasteImage() {
  navigator.clipboard.read().then(handleClipboardItems)
}


const result = reactive({
  // crop result
  dataURL: '',
  blob: null as Blob | null,
  blobURL: '',
  // id of the added transformed image
  binaryId: '',
})

async function doCrop(redo: boolean = false) {
  if (!redo) {
    if (!cropper) return
    const base64 = cropper.getDataURL()
    const blob: Blob | null = await cropper.getBlob()
    //lastBlob[0] = blob
    if (!blob) return
    result.dataURL = base64
    result.blob = blob
    result.blobURL = URL.createObjectURL(blob)
    //showCropper.value = false
  }
}

const compressed = computedAsync(async () => {
  if (!result.dataURL) {
    return ''
  }
  const type = 'image/'+local.imageType
  const quality = local.imageQuality / 100
  // no dependency tracking below
  const image = new Image()
  image.src = result.dataURL
  await new Promise(resolve => image.onload = resolve)

  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.drawImage(image, 0, 0)
  const base64 = canvas.toDataURL(type, quality)
  return base64
}, '')

function doAdd() {
  if (compressed.value.length === 0) {
    return
  }
  const m = compressed.value.match(/^data:(image\/[^;]+);base64,(.*)/)
  if (!m) {
    return
  }
  const id = newBinaryId()
  main.binaries.push({ id, type: m[1], b64: m[2] })
  result.binaryId = id
}

</script>

<template>
  <div class="main" @paste="pasteImage">

    <div style="display: flex; align-items: center;">
      <NCard :title="'Image Import'">
        <NInput placeholder="... paste here or click below" :value="''"/><br/>
        <NButton @click="pasteImage">from clipboard</NButton>
      </NCard>
      <NCard v-if="showCropper" title="Select below then">
        <NButton type="primary" @click="doCrop()">Crop!</NButton>
      </NCard>
      <NCard v-if="result.dataURL" style="height: 200px;">
        <div :style="'background-image: url(' + result.dataURL + ')'" class="crop"></div>
      </NCard>
      <NCard v-if="result.dataURL" title="Compress">
        <NSelect v-model:value="local.imageType" :options="['png', 'jpeg', 'webp'].map(value => ({ label: value, value }))" />
        <NInputNumber v-model:value="local.imageQuality" min="0" max="100" step="10" :disabled="local.imageType === 'png'" />
        <code>{{ (compressed.length / 1000).toFixed(3) }}kB</code>
      </NCard>
      <NCard v-if="result.dataURL" @click="local.bigPreview = !local.bigPreview">
        <div :style="'background-image: url(' + compressed + ')'" class="preview"></div>
      </NCard>
      <NCard v-if="result.dataURL" title="Add to library">
        <NButton type="primary" @click="doAdd()">Add</NButton>
        <br/>
        <code v-if="result.binaryId" @click="ev => copyContent(ev.target as HTMLElement)">img://{{ result.binaryId }}</code>
      </NCard>
    </div>

    <div v-if="local.bigPreview && compressed.length > 0" :style="'background-image: url(' + compressed + ')'" class="big-preview"></div>

    <div v-if="showCropper" class="cropper-container" >
      <VuePictureCropper
        :img="pic"
        :options="{
          viewMode: 1,
          dragMode: 'crop',
        }"
      ></VuePictureCropper>
    </div>
  </div>
</template>

<style scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > * {
    flex: 0;
  }
  > .cropper-container {
    flex: 1;
  }
  .crop, .preview {
    inset:0;
    position: absolute;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  .big-preview {
    width: 100%;
    min-height: 50vh;
    resize: vertical;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    border: 2px solid red;
  }
}
</style>
