<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  ContextMenuSubTrigger,
  type ContextMenuSubTriggerProps,
  useForwardProps,
} from 'radix-vue'
import { ChevronRightIcon } from '@radix-icons/vue'
import { cn } from '@/lib/utils'

const props = defineProps<ContextMenuSubTriggerProps & { class?: HTMLAttributes['class'], inset?: boolean }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <ContextMenuSubTrigger
    v-bind="forwardedProps"
    :class="cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-stone-100 focus:text-stone-900 data-[state=open]:bg-stone-100 data-[state=open]:text-stone-900 dark:focus:bg-stone-800 dark:focus:text-stone-50 dark:data-[state=open]:bg-stone-800 dark:data-[state=open]:text-stone-50',
      inset && 'pl-8',
      props.class,
    )"
  >
    <slot />
    <ChevronRightIcon class="ml-auto h-4 w-4" />
  </ContextMenuSubTrigger>
</template>
