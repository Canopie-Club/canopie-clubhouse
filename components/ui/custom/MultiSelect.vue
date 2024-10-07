<template>
  <Popover v-model:open="open">
    <PopoverTrigger ref="trigger" as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-full justify-between"
      >
        <div class="flex gap-2 justify-start">
          <template v-if="model.length">
            <div
              v-for="(val, i) in model"
              :key="i"
              class="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
            >
              {{ options.find(option => option.value === val)?.label }}
            </div>
          </template>
          <template v-else>{{ placeholder }}</template>
        </div>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-full p-0" :style="{ width: `${width}px` }">
      <Command>
        <CommandInput :placeholder="searchPrompt" />
        <CommandEmpty>No framework found.</CommandEmpty>
        <CommandGroup>
          <CommandList>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              @select="handleSetValue(option.value)"
              :disabled="isOptionDisabled(option.value)"
            >
              <Check
                :class="[
                  'mr-2 h-4 w-4',
                  model.includes(option.value) ? 'opacity-100' : 'opacity-0',
                ]"
              />
              {{ option.label }}
            </CommandItem>
          </CommandList>
        </CommandGroup>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { Button } from '#shad/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#shad/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '#shad/ui/popover'
import { useElementBounding } from '@vueuse/core'

const trigger = ref<HTMLButtonElement | null>(null)

const { width } = useElementBounding(trigger)

interface SelectOption {
  value: string
  label: string
}

interface Props {
  options: SelectOption[]
  placeholder?: string
  searchPrompt?: string
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select...',
  searchPrompt: 'Search...',
})

const open = ref(false)

const model = defineModel<string[]>({ default: () => [] })

const isMaxReached = computed(() => {
  if (props.max === undefined) return false
  if (props.max <= 1) return false
  return model.value.length >= props.max
})

const isOptionDisabled = (optionValue: string) => {
  return isMaxReached.value && !model.value.includes(optionValue)
}

const handleSetValue = (val: string) => {
  if (model.value.includes(val)) {
    model.value = model.value.filter(item => item !== val)
  } else {
    if (props.max === 1) {
      model.value = [val]
      open.value = false // Close the popover when max is 1
    } else {
      model.value = [...model.value, val]
    }
  }
}
</script>

<style scoped></style>
