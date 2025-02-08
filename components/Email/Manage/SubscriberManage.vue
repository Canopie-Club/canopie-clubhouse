<template>
  <!-- HELLO -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">Manage Subscribers</h2>
    <Table
      :columns="columns"
      :data="subscribers"
      :pagination="pagination"
      @pagination-change="handlePaginationChange"
    >
      <template #cell(actions)="{ row }">
        <Button @click="editSubscriber(row)">Edit</Button>
      </template>
    </Table>
    <SubscriberEdit
      v-if="editingSubscriber"
      :subscriber="editingSubscriber"
      @close="editingSubscriber = null"
      @update="handleSubscriberUpdate"
    />
  </div>

  <!-- {{ subscribers }} -->
  <!-- {{ subscribersData }} -->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFetch, useAsyncData } from 'nuxt/app'
import { Table } from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import SubscriberEdit from './SubscriberEdit.vue';
import type { Subscriber } from '#common/server/types/db';

const columns = [
  { key: 'email', label: 'Email' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

const props = defineProps<{
  siteId: string
}>()

const page = ref(1)
const pageSize = ref(10)
const editingSubscriber = ref<Subscriber | null>(null)

const { data: subscribersData, refresh } = useFetch(`/api/sites/${props.siteId}/subscribers/all`, {
  method: 'GET',
  params: { page: page.value, pageSize: pageSize.value },
  ...headers()
})

const subscribers = computed(() => subscribersData.value?.subscribers || [])
const totalSubscribers = computed(() => subscribersData.value?.totalCount || 0)

const pagination = computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
  totalItems: totalSubscribers.value,
}))

interface Pagination {
  page: number
  pageSize: number
  totalItems: number
}

const handlePaginationChange = (newPagination: Pagination) => {
  page.value = newPagination.page
  pageSize.value = newPagination.pageSize
}

const editSubscriber = (subscriber: Subscriber) => {
  editingSubscriber.value = subscriber
}

const handleSubscriberUpdate = async (updatedSubscriber: Subscriber) => {
  // Implement the update logic here
  // For example, you might call an API to update the subscriber
  // await $fetch(`/api/sites/${useSiteId()}/subscribers/${updatedSubscriber.id}`, {
  //   method: 'PUT',
  //   body: updatedSubscriber,
  // })

  // After updating, refresh the data and close the edit modal
  await refresh()
  editingSubscriber.value = null
}
</script>

<style scoped></style>
