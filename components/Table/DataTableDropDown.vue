<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

defineProps<{
  siteId: string
  subscriber: {
    id: string
  }
  subscription: {
    id: string
  }
}>()

function copy(id: string) {
  navigator.clipboard.writeText(id)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <!-- <DropdownMenuLabel>Actions</DropdownMenuLabel> -->
      <!-- <DropdownMenuItem @click="copy(subscriber.id)">
        Copy payment ID
      </DropdownMenuItem>
      <DropdownMenuSeparator /> -->
      <!-- <DropdownMenuItem>View customer</DropdownMenuItem> -->
      <DropdownMenuItem>
        <NuxtLink :to="`/sites/${siteId}/newsletter/contacts/${subscription.id}`">
          Manage subscriber
        </NuxtLink>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>