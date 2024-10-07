<template>
    <LayoutHeaderShad :navMenu="{mainNav: nav, secondaryNav: []}">
      <template #content>
        <div class="p-8">
          <slot />
        </div>
      </template>
    </LayoutHeaderShad>
</template>

<script setup lang="ts">

const nav = useNavigation()

</script>

<style scoped></style>
