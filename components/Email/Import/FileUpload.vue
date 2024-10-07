<template>
  <Card ref="dropZoneRef" :class="['transition-colors', isOverDropZone ? 'border-primary' : '']">
    <CardHeader>
      <CardTitle>Upload CSV File</CardTitle>
      <CardDescription>Select or drag and drop a CSV file to upload</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid w-full items-center gap-1.5">
        <Label
          for="csv"
          class="cursor-pointer text-center border border-grey text-xs rounded-md p-4 transition-colors"
          :class="{ 'bg-primary/5 border-primary border-dashed': isOverDropZone }"
          ><p v-if="file" class="font-medium">{{ file.name }}</p>
          <p v-else class="text-muted-foreground">
            Drag and drop a CSV file here, or click to select
          </p></Label
        >
        <Input
          id="csv"
          ref="fileInputRef"
          type="file"
          accept=".csv"
          @change="handleFileChange"
          class="hidden"
        />
      </div>
    </CardContent>
    <CardFooter>
      <Button @click.stop="handleUpload" :disabled="!file">
        <Upload class="mr-2 h-4 w-4" /> Upload
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDropZone } from '@vueuse/core'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Upload } from 'lucide-vue-next'

const file = ref<File | null>(null)
const dropZoneRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    file.value = target.files[0]
  }
}

const onDrop = (files: File[] | null) => {
  if (files && files.length > 0) {
    file.value = files[0]
  }
}

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

const emit = defineEmits(['fileUpload'])

const handleUpload = () => {
  if (file.value) {
    emit('fileUpload', file.value)
  }
}
</script>
