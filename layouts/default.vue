<template>
  <div class="template default">
    <div
      class="user-bar flex flex-wrap justify-between items-center"
      :class="[user ? 'logged-in' : 'anon']"
    >
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
    <div class="p-10">
      <slot></slot>
    </div>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
const user = useUser();
const route = useRoute();
const logout = useLogout();
const { locale, setLocale, locales } = useI18n();

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
          active: route.path === "/sites",
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

const changeLocale = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  setLocale(target.value);
};
</script>

<style lang="scss">
.template {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

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

  ul,
  ol {
    @apply list-disc list-inside;
    @apply mb-4;
    @apply pl-4;
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

  .user-bar {
    @apply bg-gray-100 rounded-sm;
    @apply px-4 py-2;

    &.anon {
      @apply bg-indigo-100;
    }
  }
}
</style>
