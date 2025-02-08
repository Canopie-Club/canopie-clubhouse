<template>
    <div>
        <EmailImport :site-id="siteId"/>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const siteId = route.params.siteId as string

</script>

<style scoped>

</style>