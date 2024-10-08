<template>
  <div>
    <div class="mb-6">
      <NuxtLink :to="`/sites/${siteId}/newsletter/contacts`">
        <Button variant="ghost" size="sm" @click="">
          <Icon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
          Back to Contacts
        </Button>
      </NuxtLink>
    </div>

    <EmailManageSubscriber v-if="subscriberData" :data="subscriberData" />

    <!-- <pre class="text-xs">{{ data }}</pre>
    <pre class="text-xs">{{ error }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { $ } from 'bun';
// import { Icon } from '@/components/ui/icon'

const route = useRoute();
const siteId = route.params.siteId as string;
const subscriptionId = route.params.subscriptionId as string;
// const { data, refresh } = await useFetch(`/api/sites/${siteId}/subscribers/subscription/${subscriptionId}`, headers())
const { data, error, refresh } = await useFetch(
  `/api/sites/${siteId}/newsletter/subscribers/subscription/${subscriptionId}`,
  headers()
);

const subscriberData = computed(() => {
  if (!data.value) return null;

  return {
    subscriber: {
      ...data.value.subscriber,
      createdAt: new Date(data.value.subscriber.createdAt),
      updatedAt: new Date(data.value.subscriber.updatedAt),
    },
    subscription: {
      ...data.value?.subscription,
      createdAt: new Date(data.value.subscription.createdAt),
      updatedAt: new Date(data.value.subscription.updatedAt),
      unsubscribedAt: data.value.subscription.unsubscribedAt
        ? new Date(data.value.subscription.unsubscribedAt)
        : null,
    },
  };
});

const form = reactive({
  name: data.value?.subscriber.name ?? "",
  email: data.value?.subscriber.email ?? "",
  city: data.value?.subscriber.city ?? "",
  state: data.value?.subscriber.state ?? "",
  country: data.value?.subscriber.country ?? "",
});

const isSubmitting = ref(false);

// const handleSubmit = async () => {
//   isSubmitting.value = true;
//   try {
//     await $fetch(`/api/sites/${siteId}/newsletter/subscribers/subscription/${subscriptionId}`, {
//       method: "PUT",
//       body: form,
//       ...headers(),
//     });
//     await refresh();
//     // Show success message
//   } catch (error) {
//     // Handle error
//     console.error("Error updating subscriber:", error);
//   } finally {
//     isSubmitting.value = false;
//   }
// };
</script>

<style scoped></style>
