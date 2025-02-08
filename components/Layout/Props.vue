<template>
  <UPageBody>
    <UPageHeader v-if="title" :title="title" />
    <UContainer>
      <slot />
    </UContainer>
  </UPageBody>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<style scoped></style>
