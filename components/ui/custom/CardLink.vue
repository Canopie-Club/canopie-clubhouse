<template>
  <NuxtLink :to="comingSoon ? undefined : to || href">
    <Card class="card-link" :class="{ 'coming-soon': comingSoon }">
      <div class="decoration"></div>
      <CardHeader>
        <Icon v-if="icon" :icon="icon.replace(/^i-/, '')" class="icon" />
        <slot name="header" />
      </CardHeader>
      <CardContent>
        <CardTitle>
          <slot name="title" />
          <span v-if="title">{{ title }}</span>
        </CardTitle>
        <CardDescription class="mt-4">
          <slot name="description" />
          <span v-if="description">{{ description }}</span>
        </CardDescription>
        <CardFooter>
          <slot name="footer" />
          <span v-if="footer">{{ footer }}</span>
        </CardFooter>
      </CardContent>
    </Card>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

defineProps<{
  title?: string;
  description?: string;
  icon?: string;
  footer?: string;
  to?: string;
  href?: string;
  comingSoon?: boolean;
}>();
</script>

<style lang="scss" scoped>
.card-link {
  @apply hover:bg-stone-50 box-content border-0 relative;

  .icon {
    @apply w-10 h-10 text-olive-400;
  }

  &:hover {
    .decoration {
      @apply border-2 border-olive-400;
    }
  }

  .decoration {
    @apply border border-gray-200;
    @apply absolute top-0 left-0 w-full h-full rounded-xl;
  }

  &.coming-soon {
    @apply bg-linen-50 cursor-not-allowed;

    @apply text-stone-400;

    p {
      @apply text-stone-400;
    }

    .icon {
      @apply text-stone-300;
    }

    .decoration {
      @apply border-2 border-stone-200;
    }
  }
}
</style>
