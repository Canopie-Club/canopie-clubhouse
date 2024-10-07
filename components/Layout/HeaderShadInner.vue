<template>
  <div>
    <ScrollArea class="flex-1">
      <nav class="p-4 space-y-6 pt-8">
        <ul class="space-y-2">
          <NavItem v-for="item in props.navMenu.mainNav" :key="item.title" :item="item" :topLevel="true" />
        </ul>
        <template v-if="props.navMenu.secondaryNav.length > 0">
          <div class="border-t pt-4">
            <ul class="space-y-2">
              <NavItem v-for="item in props.navMenu.secondaryNav" :key="item.title" :item="item" />
            </ul>
          </div>
        </template>
      </nav>
    </ScrollArea>
  </div>
</template>

<script setup lang="ts">
import { ScrollArea } from "@/components/ui/scroll-area";
import NavItem from "./NavItem.vue";

type NavItem = SiteLinkTree

interface NavMenu {
  mainNav: SiteLinkTree[];
  secondaryNav: SiteLinkTree[];
}

interface SidebarProps {
  navMenu?: NavMenu;
}

const props = withDefaults(defineProps<SidebarProps>(), {
  navMenu: () => ({
    mainNav: [{ title: "Home", to: "/", icon: 'i-heroicons-home' }] as SiteLinkTree[],
    secondaryNav: [] as SiteLinkTree[],
  }),
});
</script>
