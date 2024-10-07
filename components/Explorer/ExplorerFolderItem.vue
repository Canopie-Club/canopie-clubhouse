<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <div
        class="folder-container"
        :class="{ 'folder-hover': draggedOver }"
        @dragenter.prevent.stop="onDragEnter"
        @dragover.prevent.stop="onDragOver"
        @dragleave.prevent.stop="onDragLeave"
        @drop.prevent="onDrop"
        @click="renamingFolder ? () => {} : changeFolder(folder)"
      >
        <div class="flex flex-col items-center gap-0">
          <div class="folder-icon">
            <FolderIcon class="w-20 h-14" />
          </div>
          <div v-if="renamingFolder" class="folder-name text-xs">
            <input
              type="text"
              :id="`rename-folder-${folder.id}`"
              class="rename-folder-input"
              v-model="folderName"
              @blur="finishRenameFolder"
              @keydown.enter="finishRenameFolder"
            />
          </div>
          <div v-else class="folder-name text-xs">
            {{ folder.name }}
          </div>
        </div>
      </div>
      <!-- This is an empty trigger, as we're using the whole folder as a trigger -->
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem @select="contextRenameFolder"> Rename </ContextMenuItem>
      <ContextMenuItem @select="contextDeleteFolder"> Delete </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { FolderMap } from '#common/server/types/db'
import { FolderIcon } from '@heroicons/vue/24/solid'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '~/components/ui/context-menu'

const props = defineProps<{
  siteId: string
  folder: FolderMap
  changeFolder: (folder: FolderMap) => void
  refresh?: () => void
  deleteFolder?: () => void
}>()

const contextOpen = ref(false)
const contextFolder = ref<FolderMap | null>(null)

function onContextMenu(event: MouseEvent) {
  // Prevent the default context menu from appearing
  event.preventDefault()
}

const renamingFolder = ref<boolean>(false)
const folderName = ref<string>(props.folder.name)

const draggedOver = ref<boolean>(false)
const draggedItemId = ref<string | null>(null)

const onDragEnter = (_event: DragEvent) => {
  //   console.log(event)
  //   console.log('onDragEnter', props.folder.name)
  //   if (draggedItemId.value) {
  draggedOver.value = true
  //   }
  //   console.log(draggedOver.value)
}

const onDragOver = (event: DragEvent) => {
  if (draggedItemId.value) {
    event.dataTransfer!.dropEffect = 'move'
  }
}

const onDragLeave = (event: DragEvent) => {
  if (!event.relatedTarget || !(event.relatedTarget as Element).closest('.folder-container')) {
    draggedOver.value = false
  }
}

const onDrop = async (event: DragEvent) => {
  console.log(`Dropped into folder: ${props.folder.name}`)
  const files = event.dataTransfer!.files
  console.log('files', files)
  const imageId = event.dataTransfer!.getData('text/plain')
  if (imageId) {
    console.log(`Image ${imageId} dropped into folder: ${props.folder.path}`)
    const fileName = imageId.split('/').pop()
    const result = await $fetch(`/api/sites/${props.siteId}/files/rename`, {
      method: 'PUT',
      body: {
        oldPath: imageId,
        newPath: `${props.folder.path}/${fileName}`,
      },
      ...headers(),
    })
    console.log('result', result)
    props.refresh?.()
    // Move the image from it's current location to the folder
  }
  draggedOver.value = false
}

const contextRenameFolder = () => {
  contextOpen.value = false
  renameFolder()
}

const contextDeleteFolder = () => {
  contextOpen.value = false
  deleteFolder()
}

const deleteFolder = async () => {
  console.log('deleteFolder', props.folder)

  const deletedFolder = await $fetch(`/api/sites/${props.siteId}/folders/${props.folder.id}`, {
    method: 'DELETE',
    ...headers(),
  })

  props.refresh?.()

  nextTick(() => {
    props.deleteFolder?.()
  })
}

const renameFolder = () => {
  renamingFolder.value = true
  // Focus the input element when renaming starts
  nextTick(() => {
    const inputElement = document.getElementById(`rename-folder-${props.folder.id}`)
    if (inputElement instanceof HTMLInputElement) {
      inputElement.focus()
      inputElement.select()
    }
  })
}

const finishRenameFolder = async () => {
  if (!renamingFolder.value) return
  if (folderName.value === props.folder.name) {
    renamingFolder.value = false
    return
  }

  props.folder.name = folderName.value
  renamingFolder.value = false

  const result = await $fetch(`/api/sites/${props.siteId}/folders/${props.folder.id}`, {
    method: 'PUT',
    body: {
      name: props.folder.name,
    },
    ...headers(),
  })

  console.log('result', result)
}

// expose renameFolder and finishRenameFolder
defineExpose({
  renameFolder,
  finishRenameFolder,
  folder: props.folder,
})
</script>

<style lang="scss" scoped>
.folder-container {
  @apply flex justify-center h-28 items-center gap-2 bg-gray-100 p-2 rounded;
  @apply hover:bg-gray-200 cursor-pointer;
  @apply text-gray-700;
  transition: background-color 0.2s ease, color 0.2s ease;

  .folder-icon {
    @apply text-gray-300;
    transition: color 0.2s ease;
  }

  .rename-folder-input {
    @apply px-2 py-0 text-xs text-gray-500 hover:text-gray-800 cursor-pointer hover:bg-gray-50 bg-gray-100;
    @apply focus:outline-none m-auto text-center;

    max-width: calc(100% - 2rem);
    margin-left: 1rem;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  &:hover {
    @apply bg-gray-200;
    .folder-icon {
      @apply text-gray-400;
    }

    .rename-folder-input {
      @apply bg-gray-200 hover:bg-gray-50;
    }
  }

  &.folder-hover {
    @apply bg-amber-100 text-amber-500;
    .folder-icon {
      @apply text-amber-400;
    }
  }

  .context-menu {
    @apply text-xs text-gray-500 cursor-pointer;

    .item {
      @apply px-4 py-2 hover:bg-gray-100 hover:text-gray-800;
    }
  }
}
</style>
