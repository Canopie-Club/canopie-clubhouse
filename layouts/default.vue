<template>
  <div class="template default">
    <div class="user-bar flex justify-between items-center" :class="[user ? 'logged-in' : 'anon']">
        <div>
            {{ user?.name }}<span v-if="!user" style="opacity: 0">FISH</span>
        </div>

        <div class="flex gap-4">
            <template v-for="link in menuLinks">
                <template v-if="'action' in link">
                    <a class="cursor-pointer" @click="link.action">{{ $t(link.name) }}</a>
                </template>
                <template v-else>
                    <NuxtLink :to="link.path" :class="{'active': link.active}">{{ $t(link.name) }}</NuxtLink>
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
const { locale, setLocale, locales } = useI18n()

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
        }
    ];

    if (user.value) {
        links.push(...[{
            name: "Secure",
            path: "/secure",
            active: route.path === "/secure",
        }, {
            name: "Secure Two",
            path: "/secure-two",
            active: route.path === "/secure-two",
        }, {
            name: "logout",
            path: "/logout",
            action: logout,
        }]);
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

<style lang="scss" scoped>

.template {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;

    h1 {
        color: #2c3e50;
        border-bottom: 2px solid #ecf0f1;
        padding-bottom: 10px;
        margin-bottom: 20px;
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

    ul, ol {
        margin-bottom: 15px;
        padding-left: 30px;
    }

    img {
        max-width: 100%;
        height: auto;
        margin: 15px 0;
    }

    blockquote {
        border-left: 4px solid #ecf0f1;
        padding-left: 15px;
        margin: 15px 0;
        font-style: italic;
        color: #7f8c8d;
    }

    code {
        background-color: #f8f8f8;
        padding: 2px 4px;
        border-radius: 4px;
        font-family: 'Courier New', Courier, monospace;
    }

    pre {
        background-color: #f8f8f8;
        padding: 15px;
        border-radius: 4px;
        overflow-x: auto;
        margin-bottom: 15px;
    }

    .user-bar {
        background: #dbdfdf;
        border-radius: .5em;
        padding: .5em 1.5em;

        &.anon {
            background: #e1d9ec;
        }
    }
}
</style>