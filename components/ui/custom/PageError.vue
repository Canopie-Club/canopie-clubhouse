<template>
  <div></div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error?: Partial<NuxtError<unknown>>;
  ui?: Partial<{
    wrapper: string;
    status: string;
    name: string;
    message: string;
    links: string;
    default: Partial<{ clearButton: Partial<{ label: string; color: "primary"; size: "lg" }> }>;
  }>;
  name?: string;
  message?: string;
  status?: number;
  clearButton?: Partial<{ label: string; color: "primary"; size: "lg" }>;
}>();
</script>

<style scoped></style>
