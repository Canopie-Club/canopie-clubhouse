<template>
  <LayoutProps title="Profile">
    <UPageCard v-if="user" class="my-8">
      <template #title>
        Profile Overview
      </template>

      <template #description>
        <div class="profile-card flex flex-col gap-2">
          <template v-if="!editProfile">
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
          </template>
          <template v-else>
            <label>
              <strong>Name:</strong>
              <input type="text" v-model="user.name" />
            </label>
            <label>
              <strong>Email:</strong>
              <input type="email" v-model="user.email" />
            </label>

            <!-- TODO: Add password change -->
            <!-- TODO: Add address information -->
          </template>
          <p><strong>Profile Created:</strong> {{ user.createdAt }}</p>
        </div>
      </template>
      
    </UPageCard>

    <UButton @click="() => (editProfile = !editProfile)">Edit Profile</UButton>
    
  </LayoutProps>
</template>

<script setup lang="ts">
const user = useUser();

const editProfile = ref(false);
</script>

<style lang="scss" scoped>
.profile-card {
  p,
  label {
    @apply flex gap-2 h-6 items-center;
    
    strong {
      @apply inline-block w-40;
    }

    input {
      @apply border border-gray-300 outline-none rounded px-2;
      width: calc(100% - 10rem);
    // &:focus {
    // }
    }
  }
}
</style>
