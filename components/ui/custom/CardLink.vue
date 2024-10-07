<template>
  <NuxtLink :to="to || href">
    <Card class="card-link">
      <div class="decoration"></div>
      <CardHeader>
        <Icon v-if="icon" :icon="icon.replace(/^i-/, '')" class="w-10 h-10 text-primary" />
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
}>();
</script>

<style lang="scss" scoped>
.card-link {
  @apply hover:bg-stone-50 box-content border-0 relative;

  &:hover {
    .decoration {
      @apply border-2 border-primary;
    }
  }

  .decoration {
    @apply border border-gray-200;
    @apply absolute top-0 left-0 w-full h-full rounded-xl;
  }
}
</style>
