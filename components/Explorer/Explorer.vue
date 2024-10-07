<template>
  <div
    ref="explorerWindow"
    class="explorer-window"
    :class="{ 'bg-slate-50': isOverDropZone && !draggedItemId, closed: closable && !open }"
  >
    <div v-if="closable" class="close-button" @click="open = false">x</div>
    <div v-if="isOverDropZone && !draggedItemId" class="drop-overlay">
      <p class="text-slate-400 text-lg font-bold">Upload file(s)</p>
    </div>

    <ExplorerToolbar
      ref="explorerToolbar"
      :go-back="goBack"
      :add-folder="addFolder"
      :go-to-breadcrumb="goToBreadcrumb"
      :delete-folder="deleteFolder"
      :current-folder="folder"
    />
    <div
      class="main-pane"
      :class="{ 'with-footer': showFooter }"
      :style="{ height: `calc(100% - ${toolbarH}px)` }"
    >
      <!-- <div class="folder-group"> -->
      <ExplorerFolder
        v-if="folder"
        ref="explorerFolderRef"
        :site-id="props.siteId"
        :folder-map="folder"
        :change-folder="changeFolder"
        :refresh="refreshExplorer"
        @selection-changed="selectedItemChanged"
      />
      <!-- </div> -->
      <div class="footer">
        <div class="left"></div>
        <div class="right">
          <Button :disabled="!selectedItem" @click="() => confirmSelection(selectedItem)">
            Select Image
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import clone from "just-clone";
import type { Folder, FolderMap } from "#common/server/types/db";
import ExplorerFolder from "./ExplorerFolder.vue";
import { useDropZone, useElementBounding } from "@vueuse/core";
import type ExplorerToolbar from "./ExplorerToolbar.vue";
import { Button } from "~/components/ui/button";

const props = withDefaults(
  defineProps<{
    siteId: string;
    showFooter?: boolean;
    closable?: boolean;
    confirmSelection?: (path: string | null) => void;
  }>(),
  {
    closable: false,
    showFooter: false,
    confirmSelection: () => {},
  }
);

const explorerWindow = ref<HTMLDivElement | null>(null);
const explorerToolbar = ref<InstanceType<typeof ExplorerToolbar> | null>(null);
const explorerFolderRef = ref<InstanceType<typeof ExplorerFolder> | null>(null);

const selectedItem = ref<string | null>(null);
const open = defineModel("open", {
  default: true,
  type: Boolean,
});

const selectedItemChanged = (path: string | null) => {
  selectedItem.value = path ? `/_f/${path}` : null;
};

const { height: toolbarH } = useElementBounding(explorerToolbar);

const { isOverDropZone } = useDropZone(explorerWindow, {
  onDrop: (files) => onDrop(files),
});

const { data: folderMap, refresh } = useFetch<FolderMap>(
  `/api/sites/${props.siteId}/folders/map`,
  headers()
);

const currentFolder = ref<FolderMap | null>(null);

const folder = computed(() => currentFolder.value || folderMap.value || null);

const draggedItemId = computed(() => explorerFolderRef.value?.draggedItemId);

interface FindFolderOptions {
  id: string;
  name: string;
  parent?: FolderMap | null;
}

// Ensure at least one of id or name is provided
type FindCurrentFolderOptions =
  | (Partial<FindFolderOptions> & { id: string })
  | (Partial<FindFolderOptions> & { name: string });

interface FindCurrentFolderResult {
  found: FolderMap | null;
  parent: FolderMap | null;
}

const findCurrentFolder = (
  folder: FolderMap,
  options: FindCurrentFolderOptions
): FindCurrentFolderResult => {
  let { id, name, parent } = options;

  if (folder.id === id || folder.name === name) {
    parent = parent ? clone(parent) : null;
    return { found: clone(folder), parent };
  }
  for (const child of folder.children) {
    options.parent = clone(folder);
    const result = findCurrentFolder(child, options);
    if (result.found) {
      return result;
    }
  }
  return { found: null, parent: null };
};

watch(folderMap, (newFolderMap, oldFolderMap) => {
  if (newFolderMap && !currentFolder.value) {
    currentFolder.value = newFolderMap;
    return;
  }

  if (newFolderMap && currentFolder.value) {
    const folderId = currentFolder.value.id;
    // Find the current folder in the new folder map
    const { found: updatedCurrentFolder } = findCurrentFolder(newFolderMap, { id: folderId });
    if (updatedCurrentFolder) {
      currentFolder.value = updatedCurrentFolder;
      return;
    }

    if (oldFolderMap) {
      const { parent: updatedParentFolder } = findCurrentFolder(oldFolderMap, { id: folderId });
      if (updatedParentFolder) {
        currentFolder.value = updatedParentFolder;
      }
    }

    console.warn("Current folder not found in the updated folder map");
    currentFolder.value = newFolderMap;
  }
});

const refreshExplorer = async () => {
  explorerFolderRef.value?.clear();
  await nextTick();
  explorerFolderRef.value?.refreshFiles();
};

const onDrop = async (files: File[] | null) => {
  console.log("onDrop", files);
  if (!files) return;

  const formData = new FormData();
  files.forEach((file, index) => formData.append(`files[${index}]`, file));

  formData.append("filepath", folder.value?.path || "");

  const results = await $fetch(`/api/sites/${props.siteId}/files/upload`, {
    method: "POST",
    body: formData,
    ...headers(),
  });

  await refresh();
  explorerFolderRef.value?.refreshFiles();
};

const changeFolder = (childFolder: FolderMap) => {
  currentFolder.value = clone(childFolder);
};

const getParentFolder = (folder: FolderMap, id: string): FolderMap | null => {
  if (folder.id === id) return null;
  if (folder.children.some((child) => child.id === id)) return clone(folder);

  for (const child of folder.children) {
    const result = getParentFolder(child, id);
    if (result) {
      return result;
    }
  }
  return null;
};

const parentFolder = computed(() => {
  if (!folderMap.value) return null;
  if (!folder.value) return null;
  if (folderMap.value?.id === folder.value?.id) return null;
  return findCurrentFolder(folderMap.value!, { id: folder.value!.id }).parent;
});

const goBack = computed((): (() => void) | undefined => {
  if (parentFolder.value) {
    return () => {
      // currentFolder.value = breadcrumbs.value.pop()!
      currentFolder.value = parentFolder.value;
      explorerFolderRef.value?.clear();
      nextTick(() => {
        explorerFolderRef.value?.refreshFiles();
      });
    };
  }

  return undefined;
});

const goToBreadcrumb = (name: string) => {
  if (name === props.siteId) {
    currentFolder.value = folderMap.value;
    refreshExplorer();
    return;
  }

  const { found: updatedCurrentFolder } = findCurrentFolder(folderMap.value!, { name });
  if (updatedCurrentFolder) {
    currentFolder.value = updatedCurrentFolder;
    refreshExplorer();
  }
};

const addFolder = async () => {
  const newFolder = await $fetch(`/api/sites/${props.siteId}/folders/new`, {
    method: "POST",
    body: {
      name: "New Folder",
      parentId: currentFolder.value?.id,
    },
    ...headers(),
  });

  await refresh();

  nextTick(() => {
    if (explorerFolderRef.value) {
      explorerFolderRef.value.renameFolder(newFolder.id);
    }
  });
};

const deleteFolder = async () => {
  const deletedFolder = await $fetch(
    `/api/sites/${props.siteId}/folders/${currentFolder.value?.id}`,
    {
      method: "DELETE",
      ...headers(),
    }
  );

  goBack.value?.();
  refresh();

  nextTick(() => {
    const id = (deletedFolder as Folder)?.id;
    if (id) {
      folder.value!.children = folder.value!.children.filter((child) => child.id !== id);
    }
  });
};
</script>

<style lang="scss" scoped>
.explorer-window {
  @apply w-full h-full border-4 border-gray-200 rounded-lg p-4 relative bg-white;

  transition-property: opacity transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  &.is-over-drop-zone {
    @apply border-slate-400;
  }

  &.closed {
    // transform: scale(0.8);
    @apply scale-90 opacity-0 pointer-events-none;
  }

  .drop-overlay {
    @apply absolute top-0 left-0 w-full h-full bg-slate-50 flex items-center justify-center bg-opacity-50;
    @apply pointer-events-none;
  }

  .main-pane {
    grid-template-rows: 1fr;
    @apply overflow-y-scroll h-full border-t-2 border-gray-200 py-4 grid;

    .footer {
      @apply justify-between border-t-2 pt-4 hidden;
    }

    &.with-footer {
      grid-template-rows: 1fr 52px;

      .footer {
        @apply flex;
      }
    }
  }

  .close-button {
    @apply bg-rose-500 text-white rounded-full border-2 border-solid border-rose-600;
    @apply flex justify-center items-center cursor-pointer;
    @apply absolute w-5 h-5 z-10 -top-3 -right-3;
    @apply font-mono text-xs;
    @apply hover:bg-rose-600 hover:border-rose-700;
  }
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

  &:hover {
    @apply bg-gray-200;
    .folder-icon {
      @apply text-gray-400;
    }
  }

  &.folder-hover {
    @apply bg-amber-100 text-amber-500;
    .folder-icon {
      @apply text-amber-400;
    }
  }

  .folder-group {
    min-height: 80%;
  }
}

// .folder-container:hover .folder-icon,
// .folder-container.folder-hover .folder-icon {
//   @apply text-gray-400;
// }
</style>
