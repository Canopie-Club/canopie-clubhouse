<template>
  <div class="header-container relative">
    <div class="header-bar" :class="[user ? 'logged-in' : 'anon']">
      <div>{{ user?.name }}<span v-if="!user" style="opacity: 0">FISH</span></div>

      <div class="flex gap-4">
        <template v-for="link in menuLinks" :key="link.path">
          <template v-if="'action' in link">
            <a class="cursor-pointer" @click="link.action">{{ $t(link.name) }}</a>
          </template>
          <template v-else>
            <NuxtLink :to="link.path" :class="{ active: link.active }">{{
              $t(link.name)
            }}</NuxtLink>
          </template>
        </template>
      </div>
    </div>
    <div class="header-spacer"></div>
  </div>
</template>

<script setup lang="ts">
const user = useUser();
const route = useRoute();
const logout = useLogout();

interface MenuLink {
  name: string;
  path: string;
  active: boolean;
}

interface MenuAction {
  name: string;
  path: string;
  action: () => void;
}

const menuLinks = computed((): (MenuLink | MenuAction)[] => {
  const links: (MenuLink | MenuAction)[] = [
    {
      name: "home",
      path: "/",
      active: route.path === "/",
    },
  ];

  if (user.value) {
    links.push(
      ...[
        {
          name: "sites",
          path: "/sites",
          active: route.path.startsWith("/sites"),
        },
        {
          name: "logout",
          path: "/logout",
          action: logout,
        },
      ]
    );
  } else {
    links.push({
      name: "login",
      path: "/login",
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
