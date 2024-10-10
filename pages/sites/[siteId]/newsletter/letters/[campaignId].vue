<template>
  <div>
    <div class="space-y-4" v-if="campaign">
      <div class="flex flex-col gap-2 mb-4">
        <Input id="subject" variant="ghostHeader" size="xl" v-model="campaign.subject" placeholder="Subject" />
      </div>
  
      <div class="border border-gray-200 rounded-md p-4 max-h-[500px] overflow-y-auto">
        <!-- TODO: The editor options should remain at the top even when scrolled -->
        <Editor ref="editor" v-model="campaign.content" content-mode="html" />
      </div>
  
      <div class="flex gap-4 justify-start">
        <Button class="gap-2" :disabled="saveDisabled" @click="saveCampaign"><Icon name="i-lucide-save" /> Save </Button>
        <Button class="gap-2" :disabled="saveDisabled"><Icon name="i-lucide-eye" /> Preview</Button>
        <Button class="gap-2" :disabled="saveDisabled"><Icon name="i-lucide-send" /> Send Newsletter</Button>
      </div>
    </div>
    <div v-else-if="error">
      <h1 class="text-2xl font-bold">Error</h1>
      <pre class="text-xs">{{ error }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JSONContent } from "@tiptap/core";
import type Editor from "~/components/Editor/Editor.vue";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import clone from 'just-clone';
import compare from 'just-compare';

const route = useRoute();
const siteId = route.params.siteId as string;
const campaignId = route.params.campaignId as string;

const cache = ref<Record<string, any>>({});

const { data: campaign, error, status, refresh } = useFetch(`/api/sites/${siteId}/newsletter/letters/letter/${campaignId}`, {
  ...headers(),
  onResponse({response}) {
    cache.value = clone(response._data);
  }
})

async function saveCampaign() {
  const [result] = await $fetch(`/api/sites/${siteId}/newsletter/letters/letter/${campaignId}`, {
    method: 'PUT',
    body: campaign.value,
    ...headers()
  })
  
  cache.value = clone(result);
  console.log(cache.value);
  campaign.value = clone(result);
}

const editor = ref<InstanceType<typeof Editor> | null>(null);

const saveDisabled = computed(() => {
  console.log(cache.value, campaign.value);
  return compare(cache.value, campaign.value);
  // return !campaign.value?.subject || !campaign.value?.content;
});
</script>

<style scoped></style>
