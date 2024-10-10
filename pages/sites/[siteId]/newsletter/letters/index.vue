<template>
  <div class="w-full">
    <div class="mb-6">
      <Button variant="ghost" size="sm" @click="$router.push(`/sites/${siteId}/newsletter/`)">
        <Icon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
        Back to Newsletter
      </Button>
    </div>
    <div class="flex gap-2 items-center py-4">
      <Button variant="outline" size="sm" :disabled="creatingLetter" @click="createLetter">
        <Icon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
        Create New Letter
      </Button>
      <!-- <Input
          class="max-w-sm"
          placeholder="Filter emails..."
          v-model="search"
          @keypress.enter="filter(search)"
        /> -->
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

    <div
      v-if="letters.length > pagination.pageSize"
      class="flex items-center justify-end space-x-2 py-4"
    >
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

    <!-- <pre class="text-xs">{{ lettersData }}</pre> -->
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
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from "lucide-vue-next";

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
import type { EmailCampaign } from "#common/server/types/db.js";
import { NuxtLink } from "#components";
// import type { Subscription } from '@canopie-club/toolbox/dist/runtime/common/server/types/db.js'

const route = useRoute();
const router = useRouter();
const siteId = route.params.siteId as string;

const page = ref(1);
const pageSize = ref(10);

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});
const creatingLetter = ref(false);

const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
});

const search = ref<string>("");

const getLetters = async () => {
  const result = await $fetch(`/api/sites/${siteId}/newsletter/letters/all`, {
    method: "GET",
    params: {
      page: pagination.value.pageIndex + 1,
      pageSize: pagination.value.pageSize,
      sortBy: sorting.value[0]?.id,
      sortOrder: sorting.value[0]?.desc ? "desc" : "asc",
      search: search.value,
    },
    ...headers(),
  });
  return result;
};

const createLetter = async () => {
  creatingLetter.value = true;
  const result = await $fetch(`/api/sites/${siteId}/newsletter/letters/create`, {
    method: "POST",
    body: {
      subject: "Untitled",
      content: "",
    },
    ...headers(),
  });

  console.log(result);

  creatingLetter.value = false;
  router.push(`/sites/${siteId}/newsletter/letters/${result.id}`);
};

const filter = async (filter: string) => {
  search.value = filter;
  refreshData();
};

const { data: lettersData } = await useAsyncData("letters", async () => {
  return await getLetters();
});

const refreshData = async () => {
  lettersData.value = await getLetters();
};

export type ResponseLetter = SerializeObject<EmailCampaign>;

const letters = computed(() => {
  return lettersData.value?.letters || [];
});

const totalPages = computed(() => {
  return Math.ceil((lettersData.value?.totalCount || 1) / pageSize.value);
});

const sortingCreatedIcon = computed(() => {
  if (sorting.value.length === 0) return ArrowUpDown;
  if (sorting.value[0].desc) return ArrowUp;
  return ArrowDown;
});

const columns: ColumnDef<ResponseLetter>[] = [
  {
    accessorKey: "subject",
    header: () => h("div", {}, "Subject"),
    cell: ({ row }) =>
      h(
        NuxtLink,
        { class: "pl-4", to: `/sites/${siteId}/newsletter/letters/${row.original.id}` },
        row.original.subject
      ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Created At", h(sortingCreatedIcon.value, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt).toLocaleDateString();

      return h("div", { class: "lowercase" }, createdAt);
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => h("div", { class: "text-left" }, "Updated At"),
    cell: ({ row }) => {
      const updatedAt = new Date(row.original.updatedAt).toLocaleDateString();

      return h("div", { class: "text-left font-medium" }, updatedAt);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const subscriber = row.original;

      return h(
        "div",
        { class: "relative" }
        //   h(DropdownAction, {
        //     siteId,
        //     subscriber: subscriber.subscriber,
        //     subscription: subscriber.subscription,
        //     onExpand: row.toggleExpanded,
        //   })
      );
    },
  },
];

const table = useVueTable({
  get data() {
    return letters.value;
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
  onSortingChange: (updaterOrValue) => {
    valueUpdater(updaterOrValue, sorting);
    refreshData();
  },
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
