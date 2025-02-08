<template>
  <div class="logo-container flex items-center gap-2">
    <div class="logo">
      <div v-html="svgLogo" />
    </div>
    
    <div class="title">
      <span class="canopie text-linen-400">Canopie</span>
      <span class="clubhouse text-olive-500">Club.house</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import svgLogo from "~/assets/canopie-logo.svg?raw";
</script>

<style lang="scss" scoped>
.logo-container {
  font-family: "Calvin & Hobbes", "Comic Sans MS", "Comic Sans", cursive;

  .title {
    @apply text-xl font-bold;
    @apply transition-colors duration-300;

    span {
      @apply transition-colors duration-300;
    }
  }

  .logo {
    @apply top-4 left-4 w-12 h-12 flex items-center justify-center;
    @apply text-olive-500;
    @apply transition-colors duration-300;
    @apply rounded-full cursor-pointer;

    :deep(svg) {
      @apply w-full relative;

      top: -0.05rem;
      left: -0.05rem;
    }
  }

  &:hover {
    .canopie {
      @apply text-linen-500;
    }
    .clubhouse {
      @apply text-olive-700;
    }
    .logo {
      @apply text-olive-500;
      @apply text-olive-700;
    }
  }
}
</style>
