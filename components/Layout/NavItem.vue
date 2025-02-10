<template>
  <li
    class="nav-item"
    :class="{
      'top-level': topLevel,
      'child-level': !topLevel,
      'has-children': hasChildren,
      'coming-soon': item.comingSoon,
    }"
  >
    <NuxtLink
      @click="item.function && item.function()"
      :to="item.comingSoon ? undefined : item.to"
      :class="{
        [`size-${computedSize}`]: true,
        'has-children': hasChildren,
        'coming-soon': item.comingSoon,
        'functional': item.function,
      }"
      class="nav-item-link w-full justify-start pb-2"
    >
      <span class="flex items-center w-full link">
        <Icon v-if="item.icon" :name="item.icon" class="mr-2 h-5 w-5" :class="item.iconClass" />
        <!-- <component :is="item.icon" class="mr-2 h-4 w-4" /> -->
        {{ item.title || item.label }}
      </span>
      <div class="dropdown">
        <ChevronDownIcon
          v-if="hasChildren"
          class="ml-auto h-4 w-7 px-1 transition-transform"
          :class="{ 'rotate-180': isOpen }"
          @click.prevent="item.children && toggleItem()"
        />
      </div>
    </NuxtLink>
    <ul v-if="item.children && isOpen" class="m-2 mr-0">
      <NavItem v-for="child in item.children" :key="child.title" :item="child" :size="size" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChevronDownIcon } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    item: SiteLinkTree;
    size?: "xs" | "sm" | "md" | "lg";
    evenSizing?: boolean;
    topLevel?: boolean;
  }>(),
  {
    size: "sm",
    evenSizing: true,
    topLevel: false,
  }
);

const hasChildren = props.item.children && props.item.children.length > 0;

const sizeArray = ["xs", "sm", "md", "lg"];

const computedSize = computed(() => {
  if (!props.topLevel || props.evenSizing) return props.size;
  const index = sizeArray.indexOf(props.size) + 1;
  const size = sizeArray[index];
  return size ?? props.size;
});

const isOpen = ref(false);

const toggleItem = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style lang="scss" scoped>
.nav-item {
  @apply pb-1;

  .nav-item-link {
    @apply flex items-center text-stone-600;

    &.size-xs {
      @apply text-xs;
    }

    &.size-sm {
      @apply text-sm;
    }

    &.size-md,
    &.size-default {
      @apply text-base;
    }

    &.size-lg {
      @apply text-lg;
    }

    &.has-children {
      @apply font-semibold;
    }

    .link:hover {
      @apply text-stone-900;
    }

    &.functional {
      @apply cursor-pointer;
    }
  }

  &.child-level {
    @apply border-l pl-4 border-gray-200 relative;
    // padding-left: calc(1rem + 1px);

    &:hover::before {
      @apply content-[''] absolute left-[-1px] top-0 h-full w-[1px] bg-stone-500;
      height: calc(100% - 0.5rem);
    }

    // &:hover {
    //   @apply border-l pl-4 border-stone-500;
    // }

    &:last-child {
      @apply pb-0;
    }
  }

  &.coming-soon {
    @apply line-through text-gray-200 cursor-not-allowed;

    .nav-item-link {
      @apply line-through text-slate-400 cursor-not-allowed;
      pointer-events: none;

      &:hover {
        @apply line-through text-slate-400;
      }

      .link:hover {
        @apply text-slate-400;
      }
    }

    &.child-level {
      &:hover::before {
        // @apply content-[''];
        @apply content-[''] absolute left-[-1px] top-0 h-full w-[1px] bg-slate-400;
        height: calc(100% - 0.5rem);
      }
    }
  }

  .dropdown {
    @apply hover:text-stone-900 hover:font-semibold hover:bg-stone-100 rounded;
  }
}
</style>
