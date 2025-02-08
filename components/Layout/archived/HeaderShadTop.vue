<template>
  <header
    class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center"
  >
    <div class="flex space-x-4">
      <slot name="left" />
    </div>
    <Button variant="ghost" size="icon">
      <SunIcon class="h-5 w-5" />
    </Button>
  </header>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { SunIcon } from "lucide-vue-next";
</script>

<style scoped></style>
