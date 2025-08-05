<script setup lang="ts">
import { NButton, NCard, NInput } from 'naive-ui'
import { reactive, ref } from 'vue'
import VuePictureCropper, { cropper } from 'vue-picture-cropper'

import { useMainStore } from '@/stores/simple' // to ensure preloading for other tabs...
import { bytesToBase64, newBinaryId } from '@/utils'
const main = useMainStore()

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
  dataURL: '',
  blob: null as Blob | null,
  blobURL: '',
  binaryId: '',
})


async function doCrop(redo: boolean = false) {
  if (!redo) {
    if (!cropper) return
    result.status = '…'
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

function doAdd() {
  const blob = result.blob
  if (!blob) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const uint8array = new Uint8Array(e.target!.result as ArrayBuffer)
    const id = newBinaryId()
    main.binaries[id] = { type: blob.type, b64: bytesToBase64(uint8array) }
    result.binaryId = id
  }
  reader.readAsArrayBuffer(blob)

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
        <div :style="'background-image: url(' + result.dataURL + ')'" class="preview"></div>
      </NCard>
      <NCard v-if="result.dataURL" title="Add to library">
        <NButton type="primary" @click="doAdd()">Add</NButton>
        <br/>
        <code v-if="result.binaryId">img://{{ result.binaryId }}</code>
      </NCard>
    </div>

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
  .preview {
    inset:0;
    position: absolute;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
