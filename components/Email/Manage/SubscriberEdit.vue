<template>
  <Dialog :open="!!subscriber" @close="$emit('close')">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Subscriber</DialogTitle>
        <DialogDescription>
          Make changes to the subscriber's information here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="form.email" required />
        </div>
        <div class="space-y-2">
          <Label for="name">Name</Label>
          <Input id="name" v-model="form.name" />
        </div>
        <div class="space-y-2">
          <Label for="status">Status</Label>
          <Select id="status" v-model="form.status">
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
          </Select>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#shad/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'
import type { Subscriber } from '#common/server/types/db.js'

const props = defineProps<{
  subscriber: Subscriber | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update', subscriber: any): void
}>()

const form = ref({
  email: '',
  name: '',
  status: '',
})

watch(
  () => props.subscriber,
  (newSubscriber: Subscriber | null) => {
    if (newSubscriber) {
      form.value = { 
        email: newSubscriber.email,
        name: newSubscriber.name || '',
        status: ''
       }
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  emit('update', { ...props.subscriber, ...form.value })
}
</script>
