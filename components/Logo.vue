<template>
    <div class="logo flex items-center gap-2">
        <!-- <LogoChicken /> -->
        <LogoClubhouse class="h-7 w-auto cursor-pointer" />

        <!-- <div class="text-xl font-bold">
            <span class="text-amber-500">C</span>
            <span class="text-gray-500">anopie</span>
            <span class="text-amber-500">C</span>
            <span class="text-gray-500">lub.house</span>
        </div> -->
        <div class="text-xl font-bold">
            <span class="canopie text-amber-400">Canopie</span>
            <span class="clubhouse text-gray-500">Club.house</span>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.logo {
    &:hover {
        .canopie {
            @apply text-amber-500;
        }
        .clubhouse {
            @apply text-gray-800;
        }
    }
}
</style>