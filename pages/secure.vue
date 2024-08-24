<template>
    <div>
        Secure Page
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-admin"],
});

</script>

<style scoped>

</style>