<template>
  <div>
    <HeaderTop ref="headerTop" :navMenu="props.navMenu" @open-sheet="isOpen = true">
      <template #left>
        <Button variant="ghost" size="icon" class="md:hidden" @click="isOpen = true">
          <MenuIcon class="h-6 w-6" />
          <span class="sr-only">Open sidebar</span>
        </Button>

          <NuxtLink to="/" class="flex items-center justify-center">
           <Logo class="h-6 w-auto cursor-pointer" />
         </NuxtLink>
        <!-- <Button variant="ghost">Sites</Button>
        <Button variant="ghost">Logout</Button> -->
      </template>
    </HeaderTop>

    <div class="bottom flex h-full dark:bg-gray-900">
      <!-- <div class="h-screen"> -->
      <aside v-if="props.navMenu" class="aside bg-textured">
        <HeaderInner :navMenu="props.navMenu" />
      </aside>

      <Sheet v-if="props.navMenu" v-model:open="isOpen" class="bg-linen-50 bg-textured">
        <SheetContent side="left" class="w-[300px] sm:w-[400px]">
          <HeaderInner :navMenu="props.navMenu" />
        </SheetContent>
      </Sheet>
      <!-- </div> -->

      <main class="flex-1 overflow-y-auto textured bg-linen-50">
        <slot name="content" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type ComponentPublicInstance } from "vue";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { HomeIcon, MenuIcon } from "lucide-vue-next";
import HeaderInner from "./HeaderInner.vue";
import HeaderTop from "./HeaderTop.vue";
import { useElementBounding } from "@vueuse/core";

const headerTop = ref<ComponentPublicInstance | null>(null);

const { height } = useElementBounding(headerTop);

interface NavMenu {
  mainNav: SiteLinkTree[];
  secondaryNav: SiteLinkTree[];
}

interface SidebarProps {
  navMenu?: NavMenu;
}

const props = defineProps<SidebarProps>();

const isOpen = ref(false);

const topHeight = computed(() => {
  return height.value + "px";
});
</script>

<style lang="scss" scoped>
.bottom {
  height: calc(100vh);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;

  & > * {
    min-height: 100vh;
    padding-top: v-bind(topHeight);
  }

  .aside {
    @apply hidden md:flex md:flex-col md:w-72 overflow-y-auto px-4;
    @apply bg-linen-50;
    // @apply bg-white dark:bg-gray-800;
    @apply shadow-md shadow-black/15;
    @apply relative z-20;

    // box-shadow: inset -10px 0 10px -10px rgba(0, 0, 0, 0.1);
  }
}
</style>
