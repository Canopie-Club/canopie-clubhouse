<template>
    <div class="col-span-2 mt-4 bg-gray-100 p-4 rounded-md">
        <pre v-for="item in items" class="text-sm text-gray-500">{{ item }}</pre>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    items: any[]
}>(), {
    items: () => []
})

</script>

<style scoped>

</style>