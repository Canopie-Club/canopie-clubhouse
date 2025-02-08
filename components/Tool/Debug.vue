<template>
  <div class="col-span-2 mt-4 bg-gray-100 p-4 rounded-md overflow-x-scroll w-full">
    <h3 v-if="title" class="text-lg font-bold">{{ title }}</h3>
    <pre v-for="item in items" class="text-sm text-gray-500">{{ item }}</pre>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    items: any[]
    title?: string
  }>(),
  {
    items: () => [],
  },
)
</script>

<style scoped></style>
