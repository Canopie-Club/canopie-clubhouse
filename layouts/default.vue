<template>
  <div>
    <LayoutHeaderShad :navMenu="{mainNav: nav, secondaryNav: []}">
      <template #content>
        <div class="p-8">
          <slot />
        </div>
      </template>
    </LayoutHeaderShad>
    <div id="explorer"></div>
    <div id="popup"></div>
  </div>
</template>

<script setup lang="ts">

const nav = useNavigation()
const appUrl = useRuntimeConfig().app.url;
const appConfig = useAppConfig();

useSeoMeta({
  ogImage: `${appUrl}/images/og.png`,
  twitterImage: `${appUrl}/images/og.png`,
  twitterCard: "summary_large_image",
});

onBeforeMount(() => {
  // TODO: Figure out how to properly set this in the config
  if (appConfig.ui.primary !== "amber") appConfig.ui.primary = "amber";
  if (appConfig.ui.gray !== "stone") appConfig.ui.gray = "stone";
});
</script>

<style lang="scss">
.template {
  font-family: "Open Sans", "Roboto", "Montserrat", sans-serif;
  line-height: 1.6;
  color: #333;
  // max-width: 800px;
  // margin: 0 auto;

  h1 {
    @apply text-2xl font-bold text-amber-800;
  }

  p {
    margin-bottom: 15px;
  }

  a {
    @apply text-amber-500;

    &:hover {
      @apply text-amber-700;
    }
  }

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
