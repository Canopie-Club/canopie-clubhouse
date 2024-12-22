<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" size="sm" @click="$router.push(`/`)">
        <Icon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
        Back home
      </Button>
    </div>
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
        title: "Create a new site",
        description: "Create a new site to manage your content and settings.",
        icon: "i-heroicons-plus",
        to: "/create/site",
      },
    ]
    : [
        {
          title: "No sites found",
          description: "You don't have any sites yet. Create one to get started.",
          icon: "i-heroicons-map",
          to: "/create/site",
        },
      ]),
];
</script>

<style scoped></style>