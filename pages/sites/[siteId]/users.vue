<template>
  <div class="users-index">
    <RouteBack label="Back to project" />

    <div class="flex flex-row justify-between items-center">
      <h1 class="text-2xl font-bold">Users</h1>
      <UiButton class="flex flex-row gap-2" @click="addingUser = true">
        <Icon name="i-heroicons-plus" />
        New User
      </UiButton>
    </div>

    <form @submit.prevent="addUser" v-if="addingUser" class="my-4">
      <div class="flex gap-2">
        <UiInput v-model="newUserEmail" placeholder="User’s Email" />
        <UiButton type="submit">Add User</UiButton>
      </div>
      <div v-if="errorMessage" class="text-red-500 p-1 px-2 text-xs rounded-md">{{ errorMessage }}</div>
    </form>

    <div class="user-list">
      <div
        class="user-list-item textured"
        v-for="user in userList"
        :to="`/sites/${siteId}/site/users/${user.id}`"
        :key="user.id"
      >
        <div class="flex flex-row justify-between items-center">
          <div class="flex flex-row gap-2">
            <!-- <Icon name="i-heroicons-document-text" /> -->
            {{ user.name }}
          </div>
          <div class="flex flex-row gap-2 text-sm font-normal">
            {{ user.email }}
            <!-- <Icon name="i-heroicons-document-text" /> -->
          </div>
        </div>
      </div>
    </div>

    <div v-if="pageCount > 1" class="flex flex-row justify-center items-center">
      <UiPaginatedDisplay
        v-model:page="page"
        :total="userList?.length || 0"
        :sibling-count="1"
        :default-page="1"
        :items-per-page="itemsPerPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const siteId = route.params.siteId;

const { data: users, refresh } = await useFetch(`/api/sites/${siteId}/users`, headers());

const userList = computed(() => {
  return users.value?.map((response) => response.users).filter((user) => user !== null);
});

onMounted(() => {
  console.log(users.value);
});
const itemsPerPage = 5;
const page = ref(1);

const pageCount = computed(() => {
  return Math.ceil((userList.value?.length || 0) / itemsPerPage);
});

const addingUser = ref(false);
const newUserEmail = ref('');
const errorMessage = ref('');

const addUser = async () => {
  const response = await $fetch(`/api/sites/${siteId}/users`, {
    method: 'POST',
    body: { email: newUserEmail.value },
    headers: headers().headers,
  });

  if (!response.success) {
    errorMessage.value = response.message;
  }

  if (response.success) {
    addingUser.value = false;
    newUserEmail.value = '';
    errorMessage.value = '';
    refresh();
  }
};
</script>

<style lang="scss" scoped>
.users-index {
  .user-list {
    @apply flex flex-col gap-4 w-full my-4;
    min-height: calc(19rem);
    // @apply overflow-y-auto;

    .user-list-item {
      @apply border-2 border-olive-200 rounded-md;
      @apply bg-olive-100 p-4 py-2;
      @apply text-lg font-bold;
      @apply text-olive-800;

      //   &:hover {
      //     @apply bg-olive-200;
      //   }
    }
  }
}
</style>
