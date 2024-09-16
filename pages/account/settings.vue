<template>
    <LayoutProps title="Account Settings">
      <UPageCard v-if="user" class="my-8">
        <template #title>
          Account Settings
        </template>
  
        <template #description>
          <div class="profile-card flex flex-col gap-2">


            <!-- TODO: Add delete account -->
          </div>
        </template>
        
      </UPageCard>
      <UPageCard v-if="user" class="my-8">
        <template #title>
          Danger Zone
        </template>
  
        <template #description>
          <div class="profile-card flex flex-col gap-2">


            <!-- TODO: Add delete account -->
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
  