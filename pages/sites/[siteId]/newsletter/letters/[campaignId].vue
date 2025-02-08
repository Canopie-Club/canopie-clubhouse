<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" size="sm" @click="$router.push(`/sites/${siteId}/newsletter/letters/`)">
        <Icon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
        Back to Letters
      </Button>
    </div>
    <div class="space-y-4" v-if="campaign">
      <div class="flex flex-col gap-2 mb-4">
        <Input id="subject" variant="ghostHeader" size="xl" v-model="campaign.subject" placeholder="Subject" />
      </div>

      <Editor ref="editor" v-model="campaign.content" content-mode="html" :bordered="true" :max-height="'500px'" />
  
      <div class="flex gap-4 justify-start">
        <Button class="gap-2" :disabled="saveDisabled" @click="saveCampaign"><Icon name="i-lucide-save" /> Save </Button>
        <Button class="gap-2" :disabled="sendDisabled" @click="previewOpen = true"><Icon name="i-lucide-eye" /> Preview</Button>
        <Button class="gap-2" :disabled="sendDisabled"><Icon name="i-lucide-send" /> Send Newsletter</Button>
      </div>
    </div>
    <div v-else-if="error">
      <h1 class="text-2xl font-bold">Error</h1>
      <pre class="text-xs">{{ error }}</pre>
    </div>

    <LayoutPopup v-model:open="previewOpen">
      <div class="w-full h-full absolute top-0 left-0 rounded-lg overflow-y-auto bg-gray-200">
        <div class="h-4"></div>
        <div class="max-w-xl m-auto bg-white p-4 rounded-lg my-4">
          <div class="text-sm mb-2 border-b border-gray-200 border-solid pb-2">
            Subject: {{ campaign?.subject }}
          </div>
          <div v-if="previewOpen" class="preview-container clear-styles">
            <div v-html="previewContent"></div>
          </div>
        </div>
      </div>
    </LayoutPopup>
  </div>
</template>

<script setup lang="ts">
import type Editor from "~/components/Editor/Editor.vue";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import clone from 'just-clone';
import compare from 'just-compare';

const route = useRoute();
const siteId = route.params.siteId as string;
const campaignId = route.params.campaignId as string;

const cache = ref<Record<string, any> | null>(null);

const previewOpen = ref(false);

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
  campaign.value = clone(result);
}

const editor = ref<InstanceType<typeof Editor> | null>(null);

const saveDisabled = computed(() => {
  if (!cache.value) cache.value = campaign.value ? clone(campaign.value) : null;

  // Force recomputation by accessing nested properties
  const campaignSubject = campaign.value?.subject;
  const campaignContent = campaign.value?.content;

  const cachedSubject = cache.value?.subject;
  const cachedContent = cache.value?.content;
  
  return compare(cachedSubject, campaignSubject) && compare(cachedContent, campaignContent);
});

const sendDisabled = computed(() => {
  return !campaign.value?.subject || !campaign.value?.content;
});

const previewContent = computed(() => {
  if (!campaign.value) return '';
  return prepareEmailHtml(campaign.value.content, { wrap: 'div' });
});
</script>

<style scoped>
.clear-styles {
  all: initial;
}
</style>
