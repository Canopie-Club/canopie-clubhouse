<template>
  <div>
    <div class="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
      <h2 class="text-xl font-semibold">Subscriber Details</h2>
      <Button @click="toggleEditMode" variant="outline">
        {{ editMode ? "Cancel" : "Edit" }}
      </Button>
    </div>

    <form v-if="editMode" @submit.prevent="handleSubmit" class="space-y-4 max-w-md">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" v-model="form.name" />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input v-bind="componentField" v-model="form.email" type="email" />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="city">
        <FormItem>
          <FormLabel>City</FormLabel>
          <FormControl>
            <Input v-bind="componentField" v-model="form.city" />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="state">
        <FormItem>
          <FormLabel>State</FormLabel>
          <FormControl>
            <Input v-bind="componentField" v-model="form.state" />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="country">
        <FormItem>
          <FormLabel>Country</FormLabel>
          <FormControl>
            <Input v-bind="componentField" v-model="form.country" />
          </FormControl>
        </FormItem>
      </FormField>

      <Button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Updating..." : "Update Subscriber" }}
      </Button>
    </form>

    <div v-else class="subscriber-details space-y-4 max-w-md grid">
      <div v-for="field in subscriberFields" :key="field.key" class="subscriber">
        <span class="font-semibold">{{ field.label }}:</span>
        <span>{{ field.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Subscriber, Subscription } from "#common/server/types/db";

const props = defineProps<{
  data: {
    subscriber: Subscriber;
    subscription: Subscription;
  };
}>();

const editMode = ref(false);

const form = reactive({
  name: props.data.subscriber.name ?? "",
  email: props.data.subscriber.email ?? "",
  city: props.data.subscriber.city ?? "",
  state: props.data.subscriber.state ?? "",
  country: props.data.subscriber.country ?? "",
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  //   try {
  //     await $fetch(`/api/sites/${siteId}/subscribers/${subscriptionId}`, {
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
};

const toggleEditMode = () => {
  editMode.value = !editMode.value;
  if (!editMode.value) {
    // Reset form to original values when cancelling edit
    Object.assign(form, {
      name: props.data.subscriber.name ?? "",
      email: props.data.subscriber.email ?? "",
      city: props.data.subscriber.city ?? "",
      state: props.data.subscriber.state ?? "",
      country: props.data.subscriber.country ?? "",
    });
  }
};

const subscriberFields = computed(() => [
  { key: "name", label: "Name", value: props.data.subscriber.name },
  { key: "email", label: "Email", value: props.data.subscriber.email },
  { key: "city", label: "City", value: props.data.subscriber.city },
  { key: "state", label: "State", value: props.data.subscriber.state },
  { key: "country", label: "Country", value: props.data.subscriber.country },
]);
</script>

<style lang="scss" scoped>
.subscriber-details {
  .subscriber {
    @apply grid grid-cols-2 gap-2 p-4 py-2 rounded;
    // @apply odd:bg-stone-100;
    grid-template-columns: 100px 1fr;
  }
}
</style>
