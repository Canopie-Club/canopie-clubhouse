<template>
  <div class="max-w-4xl mx-auto flex items-center justify-center">
    <div class="w-full" :class="{ 'max-w-lg': flow === 'upload' }">
      <FileUpload v-if="flow === 'upload'" @file-upload="handleFileUpload" />
      <HeaderMapping
        v-if="flow === 'mapping'"
        :headers="headers"
        :dbColumns="dbColumns"
        @mapping-complete="handleMappingComplete"
      />
      <ProcessData v-if="flow === 'process'" :mapping="mapping" :file="file" :siteId="siteId" />
      <!-- TODO: <LoadingSpinner v-if="isProcessing" /> -->

      <!-- Add Back button -->
      <Button v-if="flow !== 'upload'" @click="goBack" class="mt-4" variant="outline">
        Back
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from './FileUpload.vue'
import HeaderMapping from './HeaderMapping.vue'
import ProcessData from './ProcessData.vue'
// import LoadingSpinner from '~/components/common/LoadingSpinner.vue'
import { Button } from '~/components/ui/button'
import * as Papa from 'papaparse'
import type { Subscriber } from '#common/server/types/db'

defineProps<{
  siteId: string
}>()

const flow = ref<'upload' | 'mapping' | 'process' | 'done'>('upload')
const headers = ref<string[]>([])
const dbColumns: (keyof Subscriber)[] = ['email', 'name', 'city', 'state', 'country']
// const parsedData = ref<any[]>([])

const file = ref<File | null>(null)
const mapping = ref<Record<string, string[]>>({})

const isProcessing = ref(false)

const handleFileUpload = async (uploadedFile: File) => {
  isProcessing.value = true
  file.value = uploadedFile
  await parseCsv(uploadedFile)
  isProcessing.value = false
}

const parseCsv = async (file: File) => {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = e => {
      const chunk = e.target?.result
      if (typeof chunk === 'string') {
        // Find the end of the first line
        const firstLineEnd = chunk.indexOf('\n')
        const firstLine = firstLineEnd !== -1 ? chunk.slice(0, firstLineEnd) : chunk

        Papa.parse(firstLine, {
          complete: results => {
            console.log(results)
            if (results.data && results.data.length > 0 && Array.isArray(results.data[0])) {
              headers.value = results.data[0] as string[]
              flow.value = 'mapping'
              resolve()
            } else {
              reject(new Error('Invalid data format in CSV'))
            }
          },
          delimiter: ',', // Specify the delimiter explicitly
        })
      } else {
        reject(new Error('Invalid CSV content'))
      }
    }
    reader.onerror = () => reject(new Error('Error reading file'))

    // Read only the first 1024 bytes (or less if the file is smaller)
    const blob = file.slice(0, 1024)
    reader.readAsText(blob)
  })
}

const handleMappingComplete = (confirmedMapping: Record<string, string[]>) => {
  mapping.value = confirmedMapping
  flow.value = 'process'
}

const goBack = () => {
  if (flow.value === 'mapping') {
    flow.value = 'upload'
    file.value = null
    headers.value = []
  } else if (flow.value === 'process') {
    flow.value = 'mapping'
    mapping.value = {}
  }
}
</script>

<style scoped></style>
