<template>
  <div class="bg-gray-100 p-4 rounded-lg">
    <h3 class="text-lg font-semibold mb-2">Site to be created:</h3>
    <div class="space-y-2 text-sm">
      <p><strong>Name:</strong> {{ siteInfo.name }} | <strong>url:</strong> {{ siteInfo.siteId }}.canopie.club</p>
      <p v-if="siteInfo.description"><strong>Description:</strong> {{ siteInfo.description }}</p>
      <div v-if="hasExtras" class="flex">
        <strong>Extras:</strong>
        <div class="extras w-full">
          <span class="bg-indigo-500" v-if="extras.NEWSLETTER">Newsletter / Mailing List</span>
          <span class="bg-amber-600" v-if="extras.EVENT_TICKETING">Event Ticketing</span>
          <span class="bg-stone-500" v-if="extras.BLOG">Blog</span>
          <span class="bg-stone-500" v-if="extras.SHOP">Shop</span>
        </div>
      </div>
      <div class="pt-4">
          <hr />
      </div>
      <p class="text-md font-semibold">Estimated Cost Per Month: ${{ totalCost }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SiteExtraType } from '#common/server/types/db';

interface SiteInfo {
  name?: string;
  siteId?: string;
  description?: string;
}

type Extras = {
  [key in SiteExtraType]: boolean;
}

const props = defineProps<{
  siteInfo: SiteInfo;
  extras: Extras;
}>();

const hasExtras = computed(() => Object.values(props.extras).some(Boolean));

const totalCost = computed(() => {
  const baseCost = 5;
  const extrasCost = Object.values(props.extras).filter(Boolean).length;
  return baseCost + extrasCost;
});
</script>

<style lang="scss" scoped>
.extras {
    span {
        @apply rounded text-white px-2 py-1 mx-1 text-xs;
        @apply bg-stone-300 text-stone-700;
    }
}
</style>