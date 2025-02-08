<template>
  <div class="pages-index">
    <div class="flex flex-row justify-between items-center">
      <h1 class="text-2xl font-bold">Pages</h1>
      <NuxtLink :to="`/sites/${siteId}/site/pages/new`">
        <UiButton class="flex flex-row gap-2">
          <Icon name="i-heroicons-plus" />
          New Page
        </UiButton>
      </NuxtLink>
    </div>

    <div class="page-list">
      <NuxtLink
        class="page-list-item textured"
        v-for="page in displayPages"
        :to="`/sites/${siteId}/site/pages/${page.id}`"
        :key="page.id"
      >
        <div class="flex flex-row justify-between items-center">
          <div class="flex flex-row gap-2">
            <!-- <Icon name="i-heroicons-document-text" /> -->
            {{ page.title }}
          </div>
          <div class="flex flex-row gap-2 text-sm font-normal">
            /{{ page.slug }}
            <!-- <Icon name="i-heroicons-document-text" /> -->
          </div>
        </div>
      </NuxtLink>
    </div>

    <div v-if="pageCount > 1" class="flex flex-row justify-center items-center">
      <UiPaginatedDisplay
        v-model:page="page"
        :total="site?.pages.length || 0"
        :sibling-count="1"
        :default-page="1"
        :items-per-page="itemsPerPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const siteId = useRoute().params.siteId;
const sessionId = useSessionKey();

// Add error handling for the fetch
const {
  data: site,
  error,
  pending: loading,
} = await useFetch(`/api/sites/${siteId}/detail`, {
  key: `site-${siteId}`, // Add a unique key
  default: () => ({ pages: [] }), // Add default value
  headers: {
    Authorization: `Bearer ${sessionId.value}`,
  },
});

// Move computed properties after data initialization
const sortedPages = computed(() => {
  if (!site.value?.pages) return [];
  return site.value.pages.sort((a, b) => a.slug.localeCompare(b.slug));
});

const itemsPerPage = 5;
const page = ref(1);

const pageCount = computed(() => {
  return Math.ceil((site.value?.pages?.length || 0) / itemsPerPage);
});

const displayPages = computed(() => {
  if (!sortedPages.value) return [];
  return sortedPages.value.slice((page.value - 1) * itemsPerPage, page.value * itemsPerPage);
});

// Remove console.log from onMounted
// If you need debugging, use watchEffect instead
watchEffect(() => {
  if (displayPages.value) {
    console.log('Pages updated:', displayPages.value);
  }
});
</script>

<style lang="scss" scoped>
.pages-index {
  .page-list {
    @apply flex flex-col gap-4 w-full my-4;
    min-height: calc(19rem);
    // @apply overflow-y-auto;

    .page-list-item {
      @apply border-2 border-olive-200 rounded-md;
      @apply bg-olive-100 p-4 py-2;
      @apply text-lg font-bold;
      @apply text-olive-800;

      &:hover {
        @apply bg-olive-200;
      }
    }
  }
}
</style>
