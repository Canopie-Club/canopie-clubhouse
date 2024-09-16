<template>
  <div>
    <h1>EPK</h1>
    <pre>{{ page }}</pre>
    <pre>{{ status }}</pre>
  </div>
</template>

<script setup lang="ts">
const { siteId } = useRoute().params;

const { data: page, status } = await useFetch(`/api/sites/${siteId}/pages/epk`, headers());
</script>

<style scoped></style>
