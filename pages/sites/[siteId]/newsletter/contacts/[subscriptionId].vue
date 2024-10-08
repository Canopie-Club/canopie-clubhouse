<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" size="sm" @click="$router.back()">
        <Icon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
        Back
      </Button>

      <pre class="text-xs"> {{ data }} </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const siteId = route.params.siteId as string
const subscriptionId = route.params.subscriptionId as string
const { data } = useFetch(`/api/sites/${siteId}/subscribers/${subscriptionId}`, headers())

</script>

<style scoped>

</style>