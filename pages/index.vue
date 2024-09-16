<template>
  <div>
    <UPageBody>
      <UContainer>
        <UPageGrid>
          <UPageCard v-for="(module, index) in modules" :key="index" v-bind="module">
            <template #description>
              <span class="line-clamp-2">{{ module.description }}</span>
            </template>
          </UPageCard>
        </UPageGrid>
      </UContainer>
    </UPageBody>
  </div>
</template>

<script setup lang="ts">
const user = useUser();
const sites = useSites();

const modules = [
  ...(sites.value || []).map((site) => ({
    title: site.name ?? "Untitled Site",
    description: `Review or edit the ${site.name} site.`,
    icon: "i-heroicons-map",
    to: `/sites/${site.id}`,
  })),
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
