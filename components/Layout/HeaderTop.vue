<template>
  <div>
    <!-- <div class="special-news">
      <div class="special-news-title">
        <h1 class="text-xl font-bold text-orange-500">CanopieClub.house</h1>
      </div>
    </div> -->
    <header
      class="header dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center bg-textured"
    >
  
        <!-- <h1 class="text-xl font-bold text-orange-500">CanopieClub.house</h1> -->

      <div class="w-full flex justify-between items-center">
        <div class="flex space-x-4">
          <slot name="left" />
        </div>
        <Button variant="ghost" size="icon">
          <SunIcon class="h-5 w-5" />
        </Button>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { SunIcon } from "lucide-vue-next";
</script>

<style lang="scss" scoped>
.header {
  @apply backdrop-blur-sm bg-linen-50;
  // @apply bg-white/75 dark:bg-gray-800/75;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
}
</style>
