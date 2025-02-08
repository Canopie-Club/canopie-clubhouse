<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" size="sm" @click="$router.push(backRoute || backRouteDefault)">
        <Icon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
        {{ backText }}
      </Button>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  backText: string;
  backRoute?: string;
}>();

const route = useRoute();
const backRouteDefault = computed(() => {
  const pathParts = route.path.split("/");
  pathParts.pop();
  return pathParts.join("/");
});
</script>

<style scoped></style>
