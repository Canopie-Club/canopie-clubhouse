<template>
  <Loader2
    class="animate-spin text-stone-500 [animation-duration:1s]"
    :class="sizeClasses"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from "lucide-vue-next"

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'md',
  }
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4'
    case 'lg':
      return 'w-8 h-8'
    default:
      return 'w-6 h-6'
  }
})
</script>
