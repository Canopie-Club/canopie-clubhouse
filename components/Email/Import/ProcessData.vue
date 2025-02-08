<template>
  <Card>
    <CardHeader>
      <CardTitle>Process Data</CardTitle>
      <CardDescription>Upload the mapped data to the database</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div v-if="file" class="p-4 bg-gray-100 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Selected File</h3>
          <p class="text-sm text-gray-600 flex items-center">
            <FileIcon class="w-4 h-4 mr-2 text-blue-500" />
            {{ file.name }}
          </p>
        </div>
        <div v-if="mapping" class="p-4 bg-gray-100 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Mapping Configuration</h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li v-for="(value, key) in mapping" :key="key" class="flex items-center">
              <MapPinIcon class="w-4 h-4 mr-2 text-green-500" />
              {{ key }}: {{ value.join(' + ') }}
            </li>
          </ul>
        </div>
        <Alert :variant="isProcessing || isComplete ? 'default' : 'destructive'">
          <AlertCircle v-if="!isProcessing && !isComplete" class="h-4 w-4 text-yellow-500" />
          <Loader2Icon v-if="isProcessing" class="h-4 w-4 animate-spin text-yellow-500" />
          <CheckCircle v-if="isComplete" class="h-4 w-4 text-green-500" />
          <AlertTitle>
            <span v-if="!isProcessing && !isComplete">Confirmation Required</span>
            <span v-if="isProcessing">Processing Data ({{ numProcessed }}/{{ numRows }})</span>
            <span v-if="isComplete">Data Processed</span>
          </AlertTitle>
          <AlertDescription>
            <span v-if="!isProcessing && !isComplete">
              Please review the file and mapping details above. By clicking "Process Data", you
              confirm that:
              <ul class="list-disc list-inside mt-2">
                <li>This data is correct and up-to-date</li>
                <li>
                  You have obtained explicit consent from each individual to add their email address
                  to your mailing list
                </li>
                <li>You are complying with all applicable data protection laws and regulations</li>
              </ul>
            </span>
            <span v-if="isProcessing">
              Please wait while we process the data and do not close this page. This may take a few
              minutes.
            </span>
            <span v-if="isComplete"> Data processing complete! </span>
          </AlertDescription>
        </Alert>
      </div>
    </CardContent>
    <CardFooter>
      <Button @click="handleProcess" :disabled="isProcessing || isComplete"> Process Data </Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '~/components/ui/alert'
import { CheckCircle, AlertCircle, Loader2Icon } from 'lucide-vue-next'
import * as Papa from 'papaparse'

const isProcessing = ref(false)
const isComplete = ref(false)

const props = defineProps<{
  siteId: string
  mapping: Record<string, string[]>
  file: File | null
}>()

const numProcessed = ref<number>(0)
const numRows = ref<number | null>(null)

const emit = defineEmits(['processComplete'])

const handleProcess = async () => {
  isProcessing.value = true

  if (!props.file) {
    console.error('No file selected')
    isProcessing.value = false
    return
  }

  const BATCH_OVERFLOW_SIZE = 50 // Process 10 rows at a time
  const BATCH_SIZE = 10 // Process 10 rows at a time
  const THROTTLE_DELAY = 300 // 1 second delay between batches

  let pendingProcessing = 0
  let processing = 0
  let rowCount = 0
  // let papaStream: Papa.ParseResult<unknown> | null = null

  const processRow = async (
    results: Papa.ParseResult<Record<string, string>>,
    parser: Papa.Parser,
  ) => {
    numRows.value ? numRows.value++ : (numRows.value = 1)
    // console.log('results', results)
    // Process the results here
    // ... Your processing logic ...

    try {
      if (processing >= BATCH_OVERFLOW_SIZE) {
        parser.pause()
        while (processing >= BATCH_OVERFLOW_SIZE) {
          await new Promise(resolve => setTimeout(resolve, THROTTLE_DELAY))
        }
        parser.resume()
      }
    } catch (error) {
      console.error('Error processing row', error)
    }

    pendingProcessing++

    while (processing >= BATCH_SIZE) {
      // console.log('waiting for processing to reach batch size', processing)
      await new Promise(resolve => setTimeout(resolve, THROTTLE_DELAY))
    }

    processing++

    // Simulate processing time of 0.5 seconds
    // await new Promise(resolve => setTimeout(resolve, 500))

    const { data } = results

    try {
      const subscriber = Object.entries(props.mapping).reduce((acc, [key, value]) => {
        acc[key] = value
          .map(v => (data as unknown as Record<string, string>)[v])
          .join(' ')
          .trim()
        return acc
      }, {} as Record<string, string>)
      // console.log(`Row ${rowCount} processed successfully`, subscriber)

      const result = await $fetch(`/api/sites/${props.siteId}/subscribers/import-single`, {
        method: 'POST',
        body: { subscriber },
        ...headers(),
      })
      console.log('result', result)
    } catch (error) {
      console.error('Error processing row', error)
    }

    rowCount++

    // Simulate processing with a 99% chance of success
    // console.log(`Row ${rowCount} processed successfully`)
    // const isSuccess = Math.random() < 0.99

    // if (isSuccess) {
    // } else {
    //   console.error(`Error processing row ${rowCount}`)
    // }

    processing--
    numProcessed.value++
  }

  Papa.parse(props.file, {
    // step: processRow,
    step: processRow,
    header: true,
    complete: () => {
      isProcessing.value = false
      isComplete.value = true
      emit('processComplete')
    },
    // worker: true,
    // before: (file, inputElem) => {
    //   papaStream = this
    // },
  })
}
</script>
