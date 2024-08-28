<template>
    <div>
      <h1>Sites</h1>
      <div class="sites grid gap-2 py-4">
      <template v-for="site in sites">
          <h2><a :href="`/sites/${site.id}`">{{ site.name }}</a></h2>
        </template>
      </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-admin"],
});

const sessionId = useSessionKey();

const { data: sites } = await useFetch('/api/sites/list', {
  // headers: useRequestHeaders(['authorization'])
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${sessionId.value}`
  },
})

onMounted(() => {
  console.log(sites.value)
})

</script>

<style lang="scss" scoped>

</style>