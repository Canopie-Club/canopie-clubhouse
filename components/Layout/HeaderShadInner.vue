<template>
  <div>
    <div class="p-4 border-b">
      <h1 class="text-2xl font-bold text-orange-500">CanopieClub.house</h1>
    </div>
    <ScrollArea class="flex-1">
      <nav class="p-4 space-y-6">
        <ul class="space-y-2">
          <NavItem v-for="item in props.navMenu.mainNav" :key="item.name" :item="item" />
        </ul>
        <template v-if="props.navMenu.secondaryNav.length > 0">
          <div class="border-t pt-4">
            <ul class="space-y-2">
              <NavItem v-for="item in props.navMenu.secondaryNav" :key="item.name" :item="item" />
            </ul>
          </div>
        </template>
      </nav>
    </ScrollArea>
  </div>
</template>

<script setup lang="ts">
import { ScrollArea } from "@/components/ui/scroll-area";
import { HomeIcon } from "lucide-vue-next";
import NavItem from "./NavItem.vue";

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
</script>
