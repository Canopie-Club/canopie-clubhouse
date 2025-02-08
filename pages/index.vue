<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <CardLink v-for="(module, index) in modules" :key="index" v-bind="module"> </CardLink>
  </div>
</template>

<script setup lang="ts">
const sites = useSites();
import { CardLink } from "~/components/ui/custom";

const modules = [
  ...(sites.value?.length
    ? (sites.value || []).map((site) => ({
        title: site.name ?? "Untitled Site",
        description: `Review or edit the ${site.name} site.`,
        icon: "i-heroicons-map",
        to: `/sites/${site.id}`,
      }))
    : [
        {
          title: "No sites found",
          description: "You don't have any sites yet. Create one to get started.",
          icon: "i-heroicons-map",
          to: "/create/site",
        },
      ]),
  {
    title: "Account",
    description: "Edit your account information.",
    to: "/account/profile",
    icon: "i-heroicons-user",
  },
  {
    title: "Settings",
    description: "Edit your account settings.",
    to: "/account/settings",
    icon: "i-heroicons-cog",
  },
];
</script>

<style scoped></style>
