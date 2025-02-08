<template>
  <div class="max-w-md mx-auto mt-10 border-gray-200 p-4 rounded-md">
    <h1 class="text-2xl font-bold text-center mb-4">Sign up</h1>
    <form class="space-y-4" @submit="onSubmit">
      <FormField v-slot="{ field }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input v-bind="field" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input v-bind="field" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input v-bind="field" type="password" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="confirmPassword">
        <FormItem>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl>
            <Input v-bind="field" type="password" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="w-full">Submit</Button>
      <div v-if="responseError" class="text-red-500 text-xs">{{ responseError }}</div>
    </form>
    <div class="text-sm text-center pt-4 text-stone-600">
      Already have an account?
      <NuxtLink to="/login" class="text-amber-500 hover:text-amber-600">Login</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

definePageMeta({
  layout: "login",
});

const user = useUser();
const sites = useSites();
const sessionKey = useSessionKey();

const schema = toTypedSchema(
  z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email").min(2).max(50),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
);

const form = useForm({
  validationSchema: schema,
});

const responseError = ref<string | null>(null);

const onSubmit = form.handleSubmit(async (values) => {
  console.log(values);

  const { email, password, confirmPassword, name } = values;

  if (password !== confirmPassword) {
    responseError.value = "Passwords do not match";
    return;
  }

  const result = await $fetch("/api/auth/signup", {
    method: "POST",
    body: { email, password, name },
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

  sites.value = result.sites;

  const redirect = useRoute().query.redirect as string;

  await navigateTo(redirect || "/");
});

onMounted(() => {
  if (user.value) {
    responseError.value = "You are already logged in";
  }
});
</script>

<style scoped></style>
