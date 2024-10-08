<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" size="sm" @click="$router.back()">
        <Icon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
        Back
      </Button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4 max-w-md">
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
        {{ isSubmitting ? 'Updating...' : 'Update Subscriber' }}
      </Button>
    </form>

    <pre class="text-xs">{{ data }}</pre>
    <pre class="text-xs">{{ error }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
// import { Icon } from '@/components/ui/icon'

const route = useRoute()
const siteId = route.params.siteId as string
const subscriptionId = route.params.subscriptionId as string
// const { data, refresh } = await useFetch(`/api/sites/${siteId}/subscribers/subscription/${subscriptionId}`, headers())
const { data, error, refresh } = await useFetch(`/api/sites/${siteId}/subscribers/subscription/${subscriptionId}`, headers())

const form = reactive({
  name: data.value?.subscriber.name ?? '',
  email: data.value?.subscriber.email ?? '',
  city: data.value?.subscriber.city ?? '',
  state: data.value?.subscriber.state ?? '',
  country: data.value?.subscriber.country ?? '',
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await $fetch(`/api/sites/${siteId}/subscribers/${subscriptionId}`, {
      method: 'PUT',
      body: form,
      ...headers(),
    })
    await refresh()
    // Show success message
  } catch (error) {
    // Handle error
    console.error('Error updating subscriber:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>

</style>