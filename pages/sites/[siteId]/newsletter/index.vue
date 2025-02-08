<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" size="sm" @click="$router.push(`/sites/${siteId}/`)">
        <Icon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
        Back to {{ siteId }}
      </Button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UiCardLink v-for="(module, index) in modules" :key="index" v-bind="module"> </UiCardLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";

const route = useRoute();

const siteId = route.params.siteId;

const modules = [
  {
    title: "Manage Contacts",
    description: "View, add, edit, or remove newsletter contacts.",
    to: `/sites/${siteId}/newsletter/contacts`,
    icon: "i-heroicons-users",
  },
  {
    title: "Letters",
    description: "Create, edit, and send newsletter letters.",
    to: `/sites/${siteId}/newsletter/letters`,
    icon: "i-heroicons-envelope-open",
  },
];
</script>

<style scoped></style>
