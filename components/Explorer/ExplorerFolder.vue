<template>
  <div>
    <div class="parent-folder">
      <template v-for="(folder, index) in folderMap?.children || []" :key="folder.id">
        <ExplorerFolderItem
          ref="folderItems"
          :id="index.toString()"
          :folder="folder"
          :site-id="siteId"
          :change-folder="openFolder"
          :refresh="refreshAll"
          :delete-folder="() => deleteFolder(folder.id)"
        />
      </template>
      <template v-for="(file, index) in files?.blobs || []" :key="index">
        <ExplorerItem
          :id="file.pathname"
          :file="{ ...file, uploadedAt: new Date(file.uploadedAt) }"
          :class="{ selected: selectedItem === file.pathname }"
          @dragstart="onItemDragStart"
          @dragend="onItemDragEnd"
          @click="() => selectItem(file.pathname)"
        />
      </template>
    </div>
    <!-- <LayoutDebug :items="['FolderMap:', folderMap]" /> -->
  </div>
</template>

<script setup lang="ts">
import type { FolderMap } from '#common/server/types/db'
import type ExplorerFolderItem from './ExplorerFolderItem.vue'

const props = defineProps<{
  siteId: string
  folderMap: FolderMap
  changeFolder: (folder: FolderMap) => void
  refresh?: () => void
}>()

const {
  data: files,
  status: filesStatus,
  clear,
} = useFetch(`/api/sites/${props.siteId}/files/uploads/${props.folderMap.path}`, headers())

const selectedItem = ref<string | null>(null)

const selectItem = (pathname: string) => {
  if (selectedItem.value === pathname) {
    selectedItem.value = null
  } else {
    selectedItem.value = pathname
  }

  emit('selectionChanged', selectedItem.value)

  console.log(selectedItem.value)
}

const refreshFiles = async () => {
  const response = await $fetch(
    `/api/sites/${props.siteId}/files/uploads/${props.folderMap.path}`,
    headers(),
  )
  files.value = response
}

const refreshAll = () => {
  // console.log('refreshAll', props.folderMap.path)
  clear()
  props.refresh?.()
  nextTick(() => {
    // console.log('refreshFiles', props.folderMap.path)
    refreshFiles()
  })
}

const openFolder = (folder: FolderMap) => {
  props.changeFolder(folder)
  refreshAll()
}

const folderItems = ref<(typeof ExplorerFolderItem)[]>([])

const renamingFolder = ref<FolderMap | null>(null)

const draggedOverFolder = ref<string | null>(null)
const draggedItemId = ref<string | null>(null)

const onItemDragStart = (id: string) => {
  draggedItemId.value = id
}

const onItemDragEnd = () => {
  console.log('Dragon')
  draggedItemId.value = null
  draggedOverFolder.value = null
}

const deleteFolder = (folderId: string) => {
  const folder = props.folderMap.children.find(child => child.id === folderId)
  if (folder) {
    folder.children = []
  }
  props.refresh?.()
}

const renameFolder = (folderId: string) => {
  // Find the ExplorerFolderItem component with the matching folderId
  const folderItemRef = folderItems.value.find(
    (item: typeof ExplorerFolderItem) => item.folder.id === folderId,
  )

  if (folderItemRef) {
    // Call the renameFolder method on the ExplorerFolderItem component
    folderItemRef.renameFolder()
  } else {
    console.error(`Folder with id ${folderId} not found`)
  }
}

const finishRenameFolder = async (folder: FolderMap) => {
  if (!renamingFolder.value) return
  if (renamingFolder.value.name === folder.name) {
    renamingFolder.value = null
    return
  }
  console.log('finishRenameFolder', renamingFolder.value.name, folder.id)
  folder.name = renamingFolder.value.name
  renamingFolder.value = null

  const result = await $fetch(`/api/sites/${props.siteId}/folders/${folder.id}`, {
    method: 'PUT',
    body: {
      name: folder.name,
    },
    ...headers(),
  })

  console.log('result', result)
}

// expose renameFolder and finishRenameFolder
defineExpose({
  renameFolder,
  refreshFiles,
  finishRenameFolder,
  clear,
  draggedItemId,
})

const emit = defineEmits(['selectionChanged'])
</script>

<style lang="scss" scoped>
.parent-folder {
  @apply grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5;
}

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
    @apply px-4 py-2 text-xs text-gray-500 hover:text-gray-800 cursor-pointer hover:bg-gray-100;
  }
}

// .folder-container:hover .folder-icon,
// .folder-container.folder-hover .folder-icon {
//   @apply text-gray-400;
// }
</style>
