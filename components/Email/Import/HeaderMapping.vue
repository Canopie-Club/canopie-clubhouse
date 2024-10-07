<template>
  <Card>
    <CardHeader>
      <CardTitle>Map CSV Headers to Database Columns</CardTitle>
      <CardDescription>
        Select the corresponding database column for each CSV header
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4 relative">
        <div v-for="column in dbColumns" :key="column" class="grid grid-cols-2 items-center gap-4">
          <Label :for="column">{{ column }}</Label>
          <MultiSelect
            v-model="mapping[column]"
            :max="column === 'name' ? 2 : 1"
            placeholder="Select CSV Header"
            :options="headers.map(header => ({ label: header, value: header }))"
          />
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button @click="handleMappingComplete">Confirm Mapping</Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
import MultiSelect from '~/components/ui/custom/MultiSelect.vue'

const props = defineProps<{
  headers: string[]
  dbColumns: string[]
  mapping?: Record<string, string[]>
}>()

const mapping = ref<Record<string, string[]>>({})

const emit = defineEmits(['mappingComplete'])

const handleMappingComplete = () => {
  emit('mappingComplete', mapping.value)
}
</script>
