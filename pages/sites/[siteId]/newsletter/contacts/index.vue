<template>
  <div class="w-full">
    <div class="mb-6">
      <Button variant="ghost" size="sm" @click="$router.back()">
        <Icon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
        Back
      </Button>
    </div>
    <div class="flex gap-2 items-center py-4">
      <Input
        class="max-w-sm"
        placeholder="Filter emails..."
        :model-value="table.getColumn('email')?.getFilterValue() as string"
        @update:model-value="table.getColumn('email')?.setFilterValue($event)"
      />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columns <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :checked="column.getIsVisible()"
            @update:checked="
              (value) => {
                column.toggleVisibility(!!value);
              }
            "
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center"> No results. </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="pr-4">
        <NuxtLink :to="`${route.path}/import`">
          <Button size="sm" variant="outline">Import Subscribers</Button>
        </NuxtLink>
      </div>

      <div class="flex-1 text-sm text-muted-foreground">
        Page {{ pagination.pageIndex + 1 }} of {{ totalPages }}
      </div>

      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </Button>
      </div>
    </div>

    <div></div>

    <!-- <pre class="text-xs">{{ subscribersData }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { ArrowUpDown, ChevronDown } from "lucide-vue-next";

import { h, ref } from "vue";
import DropdownAction from "@/components/Table/DataTableDropDown.vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { valueUpdater } from "@/lib/utils";
// import type { Subscription } from '@canopie-club/toolbox/dist/runtime/common/server/types/db.js'

const route = useRoute();

const siteId = route.params.siteId as string;

const page = ref(1);
const pageSize = ref(10);
const editingSubscriber = ref<SubscriberWithSubscription | null>(null);

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
});

// const { data: subscribersData, refresh } = useFetch(`/api/sites/${siteId}/subscribers/all`, {
//   method: "GET",
//   params: { page: pagination.value.pageIndex + 1, pageSize: pagination.value.pageSize },
//   ...headers(),
// });

const getSubscribers = async () => {
  const result = await $fetch(`/api/sites/${siteId}/subscribers/all`, {
    method: "GET",
    params: { page: pagination.value.pageIndex + 1, pageSize: pagination.value.pageSize },
    ...headers(),
  });
  return result;
};

const { data: subscribersData } = await useAsyncData("subscribers", async () => {
  return await getSubscribers();
});

const refreshData = async () => {
  subscribersData.value = await getSubscribers();
};

export interface Subscription {
  siteId: string;
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  subscriberId: string;
  subscriptionMethod: "FORM" | "API" | "IMPORT" | "MANUAL" | null;
  unsubscribedAt: Date | string | null;
}

export interface Subscriber {
  name: string | null;
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  email: string;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface SubscriberWithSubscription {
  subscription: Subscription;
  subscriber: Subscriber;
}

const subscriptions = computed(() => {
  return subscribersData.value?.subscribers || [];
});

const totalPages = computed(() => {
  return Math.ceil((subscribersData.value?.totalCount || 1) / pageSize.value);
});

const columns: ColumnDef<SubscriberWithSubscription>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) =>
  //     h(Checkbox, {
  //       checked:
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate"),
  //       "onUpdate:checked": (value) => table.toggleAllPageRowsSelected(!!value),
  //       ariaLabel: "Select all",
  //     }),
  //   cell: ({ row }) =>
  //     h(Checkbox, {
  //       checked: row.getIsSelected(),
  //       "onUpdate:checked": (value) => row.toggleSelected(!!value),
  //       ariaLabel: "Select row",
  //     }),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "pl-4" }, row.original.subscriber.name || ""),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Email", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => h("div", { class: "lowercase" }, row.original.subscriber.email),
  },
  {
    accessorKey: "location",
    header: () => h("div", { class: "text-left" }, "Location"),
    cell: ({ row }) => {
      const subscriber = row.original.subscriber;
      const { city, state, country } = subscriber;

      const location = [city, state, country].filter(Boolean).join(", ");

      return h("div", { class: "text-left font-medium" }, location);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const subscriber = row.original;

      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          siteId,
          subscriber: subscriber.subscriber,
          subscription: subscriber.subscription,
          onExpand: row.toggleExpanded,
        })
      );
    },
  },
];

const table = useVueTable({
  get data() {
    return subscriptions.value;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
  get pageCount() {
    return totalPages.value;
  },
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  onPaginationChange: (updaterOrValue) => {
    valueUpdater(updaterOrValue, pagination);
    // Refresh data when pagination changes
    refreshData();
  },

  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
    get pagination() {
      return pagination.value;
    },
  },
});

// watch(table, (newVal) => {
//   console.log("newVal", newVal.getState().pagination);
// });

// Add a watch effect to refresh data when pagination changes
// watch(
//   () => pagination.value,
//   () => {
//     refreshData();
//   },
//   { deep: true }
// );
</script>
