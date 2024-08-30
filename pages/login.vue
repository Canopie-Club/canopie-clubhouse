<template>
  <div>
    <!-- <form @submit="onSubmit"></form> -->
    <div class="max-w-md mx-auto mt-10 border border-gray-200 p-4 rounded-md">
      <h1 class="text-2xl font-bold text-left mb-4">Login</h1>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton color="amber" block type="submit"> Submit </UButton>
      </UForm>
      <div class="text-red-500 pt-4 text-sm">{{ responseError }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { RoleType } from "~/assets/types/db";

const user = useUser();
const sessionKey = useSessionKey();

const schema = z.object({
  email: z.string().email("Invalid email").min(2).max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
});

const responseError = ref<string | null>(null);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  const { email, password } = event.data;

  const result = await $fetch("/api/auth/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });

  if (!result.success) {
    responseError.value = result.message;
    return;
  }

  responseError.value = null;

  if (!result.session) {
    responseError.value = "No session found";
    return;
  }

  sessionKey.value = result.session.id;
  user.value = {
    ...result.user,
    role: result.user.role as RoleType,
    createdAt: new Date(result.user.createdAt),
    updatedAt: new Date(result.user.updatedAt),
  };

  await navigateTo("/");
}

onMounted(() => {
  if (user.value) {
    responseError.value = "You are already logged in";

    // navigateTo("/");
  }
});
</script>

<style scoped></style>