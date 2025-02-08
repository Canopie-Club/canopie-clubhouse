<template>
  <div class="w-full mb-4 flex gap-2 items-center justify-between">
    <div class="flex gap-2">
      <Button v-if="goBack" class="icon-button" size="icon" @click="goBack">
        <ArrowLeftIcon class="h-4 w-4" />
      </Button>
      <Button v-if="addFolder" class="icon-button" size="icon" @click="addFolder">
        <FolderPlusIcon class="h-4 w-4" />
      </Button>
      <Button v-if="renameFolder" class="icon-button" size="icon" @click="renameFolder">
        <PencilIcon class="h-4 w-4" />
      </Button>
    </div>
    <div class="flex gap-2 text-sm text-gray-500 items-center">
      <template v-for="(breadcrumb, index) in breadcrumbs">
        <span v-if="index > 0" class="cursor-default text-gray-400">/</span>
        <span
          v-if="index < breadcrumbs.length - 1"
          class="cursor-pointer hover:text-gray-800"
          @click="goToBreadcrumb(breadcrumb)"
          >{{ breadcrumb }}</span
        >
        <span v-else class="cursor-default">{{ breadcrumb }}</span>
      </template>

      <Button v-if="deleteFolder" size="icon" @click="deleteFolder" class="icon-button danger">
        <TrashIcon class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, FolderPlusIcon, TrashIcon, PencilIcon } from '@heroicons/vue/24/solid'
import { Button } from '~/components/ui/button'

const props = withDefaults(
  defineProps<{
    backLocation?: string
    goBack?: () => void
    goToBreadcrumb?: (id: string) => void
    addFolder?: () => void
    renameFolder?: () => void
    deleteFolder?: () => void
    currentFolder?: FolderMap | null
  }>(),
  {
    goToBreadcrumb: () => {},
  },
)

const breadcrumbs = computed(() => props?.currentFolder?.path?.split('/') || [])
</script>

<style lang="scss" scoped>
.icon-button {
  @apply cursor-pointer w-10 flex justify-center items-center p-2 rounded;
  @apply bg-gray-200 text-gray-500;
  @apply hover:bg-gray-100 hover:text-gray-400;

  &.danger {
    @apply bg-red-200 text-red-400;
    @apply hover:bg-red-100 hover:text-red-300;
  }
}
</style>
