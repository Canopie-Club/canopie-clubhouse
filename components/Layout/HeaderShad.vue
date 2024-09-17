<script setup lang="ts">
import { ref } from "vue";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { HomeIcon, MenuIcon } from "lucide-vue-next";
import NavItem from "./NavItem.vue";
import HeaderShadInner from "./HeaderShadInner.vue";
import HeaderShadTop from "./HeaderShadTop.vue";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  current?: boolean;
  children?: NavItem[];
}

interface NavMenu {
  mainNav: NavItem[];
  secondaryNav: NavItem[];
}

interface SidebarProps {
  navMenu?: NavMenu;
}

const props = withDefaults(defineProps<SidebarProps>(), {
  navMenu: () => ({
    mainNav: [{ name: "Home", href: "/", icon: HomeIcon }],
    secondaryNav: [],
  }),
});

const isOpen = ref(false);
</script>

<template>
  <aside
    class="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
  >
    <HeaderShadInner :navMenu="props.navMenu" />
  </aside>

  <Sheet v-model:open="isOpen">
    <SheetContent side="left" class="w-[300px] sm:w-[400px]">
      <HeaderShadInner :navMenu="props.navMenu" />
    </SheetContent>
  </Sheet>

  <main class="flex-1 overflow-y-auto">
    <HeaderShadTop :navMenu="props.navMenu" @open-sheet="isOpen = true">
      <template #left>
      <Button variant="ghost" size="icon" class="md:hidden" @click="isOpen = true">
        <MenuIcon class="h-6 w-6" />
        <span class="sr-only">Open sidebar</span>
      </Button>
      <Button variant="ghost">Sites</Button>
        <Button variant="ghost">Logout</Button>
      </template>
    </HeaderShadTop>
    <slot name="content" />
  </main>
</template>
