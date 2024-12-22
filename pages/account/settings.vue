<template>
    <LayoutProps title="Account Settings">
      <Card v-if="user" class="my-8">
        <CardHeader>
          <CardTitle>
            Account Settings
          </CardTitle>
        </CardHeader>
  
        <CardContent>
          <div class="profile-card flex flex-col gap-2">


            <!-- TODO: Add delete account -->
          </div>
        </CardContent>
        
      </Card>
      <Card v-if="user" class="my-8">
        <CardHeader>
          <CardTitle>
            Danger Zone
          </CardTitle>
        </CardHeader>
  
        <CardContent>
          <div class="profile-card flex flex-col gap-2">


            <!-- TODO: Add delete account -->
          </div>
        </CardContent>
        
      </Card>
  
      <Button @click="() => (editProfile = !editProfile)">Edit Profile</Button>
      
    </LayoutProps>
  </template>
  
  <script setup lang="ts">
  import { Button } from "~/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";

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
  