<template>
  <UHeader :links="menuLinks">
    <template #logo>
      <Logo class="w-auto h-6" />
    </template>
    <template #right>
      <UColorModeButton />
      <!-- <UButton to="https://github.com/nuxt/ui" target="_blank" icon="i-simple-icons-github" color="gray" variant="ghost" /> -->
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { HeaderLink, HeaderPopoverLink } from "@nuxt/ui-pro/types";
const { t } = useI18n();

const user = useUser();
const route = useRoute();
const logout = useLogout();

const menuLinks = computed(() => {
  const links: (HeaderLink | HeaderPopoverLink)[] = [];

  if (user.value) {
    links.push(
      ...[
        {
          label: t("sites"),
          icon: "i-heroicons-book-open",
          to: "/sites",
          active: route.path.startsWith("/sites"),
        },
        {
          label: t("logout"),
          icon: "i-heroicons-arrow-left-start-on-rectangle-solid",
          click: logout,
        },
      ]
    );
  } else {
    links.push({
      label: t("login"),
      to: "/login",
      icon: "i-heroicons-arrow-left-end-on-rectangle-solid",
      active: route.path === "/login",
    });
  }

  return links;
});
</script>

<style lang="scss" scoped>
.header-spacer,
.header-bar {
  @apply h-16 mb-4;
}

.header-bar {
  @apply absolute top-0 left-0 w-full;
  @apply flex flex-wrap justify-between items-center;
  @apply bg-white bg-opacity-95 border-b-2 border-gray-100;
  @apply px-4 py-2;

  //   &.anon {
  //     @apply border-amber-100;
  //   }

  a {
    @apply px-2 py-1 rounded-md;

    &.active {
      @apply text-amber-700 bg-amber-100;
    }
  }
}
</style>
