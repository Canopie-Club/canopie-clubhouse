<template>
  <div class="template default">
    <LayoutHeader />
    <div class="template-content grid min-h-[calc(100vh-5rem)]">
      <UContainer class="w-full">
        <slot></slot>
      </UContainer>
      <LayoutFooter />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.template {
  font-family: "Open Sans", "Roboto", "Montserrat", sans-serif;
  line-height: 1.6;
  color: #333;
  // max-width: 800px;
  margin: 0 auto;

  h1 {
    @apply text-2xl font-bold text-indigo-800;
  }

  p {
    margin-bottom: 15px;
  }

  a {
    @apply text-indigo-500;

    &:hover {
      @apply text-indigo-700;
    }

    &.active {
      @apply text-emerald-700;
    }
  }

  // ul,
  // ol {
  //   @apply list-disc list-inside;
  //   @apply mb-4;
  //   @apply pl-4;
  // }

  img {
    @apply max-w-full h-auto;
    @apply mb-4;
  }

  blockquote {
    border-left: 4px solid #ecf0f1;
    @apply pl-4 mb-4 italic text-gray-500;
  }

  code {
    @apply bg-gray-100 px-2 py-1 rounded-md font-mono;
  }

  pre {
    @apply bg-gray-100 px-4 py-2 rounded-md font-mono overflow-x-auto mb-4;
  }

  .template-content {
    grid-template-rows: 1fr 5rem;
  }
}
</style>
