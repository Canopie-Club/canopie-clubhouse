<template>
  <Pagination
    v-slot="{ page, pageCount }"
    :total="total"
    :items-per-page="itemsPerPage"
    :sibling-count="siblingCount"
    show-edges
    :default-page="defaultPage"
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
      <PaginationFirst @click="pageModel = 1" />
      <PaginationPrev @click="pageModel = page - 1" />

      <template v-for="(item, index) in items">
        <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
          <Button
            @click="pageModel = item.value"
            class="w-10 h-10 p-0"
            :variant="item.value === page ? 'default' : 'outline'"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :key="item.type" :index="index" />
      </template>

      <PaginationNext @click="pageModel = page + 1" />
      <PaginationLast @click="pageModel = pageCount" />
    </PaginationList>
  </Pagination>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";

const props = withDefaults(
  defineProps<{
    total: number;
    defaultPage?: number;
    itemsPerPage?: number;
    siblingCount?: number;
  }>(),
  {
    total: 0,
    defaultPage: 1,
    itemsPerPage: 10,
    siblingCount: 1,
  }
);

const pageModel = defineModel<number>("page", { required: true });
</script>
