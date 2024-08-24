<template>
  <div>
    <!-- <form @submit="onSubmit"></form> -->
    <div class="max-w-md mx-auto">
      <!-- <Form> -->
      <form :validation-schema="formSchema" @submit="onSubmit">
        <div class="flex flex-col gap-6">
          <!-- <div class="flex flex-col gap-2"> -->
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <UiInput placeholder="Email Address" v-bind="componentField" />
              </FormControl>
              <!-- <FormDescription>
                This is your public display name.
              </FormDescription> -->
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- </div> -->
          <!-- <div class="flex flex-col gap-2"> -->
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <UiInput v-bind="componentField" type="password" placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- </div> -->
          <UiButton type="submit">Submit</UiButton>
        </div>
      </form>
      <div class="text-red-500 pt-4 text-sm">{{ responseError }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const user = useUser();
const sessionKey = useSessionKey();

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email().min(2).max(50),
    password: z.string().min(8),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const responseError = ref<string | null>(null);

const onSubmit = form.handleSubmit(async (values) => {
  const { email, password } = values;

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
    createdAt: new Date(result.user.createdAt),
    updatedAt: new Date(result.user.updatedAt)
  };

  await navigateTo("/");
});

onMounted(() => {
  if (user.value) {
    responseError.value = "You are already logged in";

    // navigateTo("/");
  }
});
</script>

<style scoped></style>
