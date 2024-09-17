<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from 'lucide-vue-next'

interface NavItem {
  name: string
  href: string
  icon: any
  current?: boolean
  children?: NavItem[]
}

const props = withDefaults(defineProps<{
  item: NavItem
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs'
}>(), {
  size: 'default'
})

const isOpen = ref(false)

const toggleItem = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <li>
    <Button
      variant="ghost"
      :size="size"
      class="w-full justify-start"
      @click="item.children && toggleItem()"
    >
      <component :is="item.icon" class="mr-2 h-4 w-4" />
      {{ item.name }}
      <ChevronDownIcon
        v-if="item.children"
        class="ml-auto h-4 w-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </Button>
    <ul v-if="item.children && isOpen" class="mt-2 ml-4 space-y-2">
      <NavItem
        v-for="child in item.children"
        :key="child.name"
        :item="child"
        :size="size === 'default' ? 'sm' : size"
      />
    </ul>
  </li>
</template>