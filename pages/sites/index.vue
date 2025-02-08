<template>
  <div>
    <RouteBack label="Back home" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CardLink v-for="(module, index) in modules" :key="index" v-bind="module"> </CardLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { CardLink } from "~/components/ui/custom";

const sites = useSites();

const modules = [
  ...(sites.value?.length
    ? [...(sites.value || []).map((site) => ({
        title: site.name ?? "Untitled Site",
        description: `Review or edit the ${site.name} site.`,
        icon: "i-heroicons-map",
        to: `/sites/${site.id}`,
      })),
      {
        title: "Create a new project",
        description: "Create a new project to manage your content and settings.",
        icon: "i-heroicons-plus",
        to: "/create/project",
      },
    ]
    : [
        {
          title: "No projects found",
          description: "You don't have any projects yet. Create one to get started.",
          icon: "i-heroicons-map",
          to: "/create/project",
        },
      ]),
];
</script>

<style scoped></style>