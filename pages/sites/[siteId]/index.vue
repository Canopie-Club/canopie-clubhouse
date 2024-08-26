<template>
    <div>
      <div v-if="site">
        <h1 class="mb-4">{{ site.name }}</h1>
        <div class="flex flex-col gap-4">
          <UiInput v-model="siteName" />
          <Select v-model="siteTemplate">
            <SelectTrigger>
              <SelectValue placeholder="Select a Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Templates</SelectLabel>
                <SelectItem v-for="template in templates" :value="template.value" :key="template.value">
                  {{ template.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <a class="bg-indigo-100 rounded hover:bg-indigo-200 p-4" v-for="page in site.pages" :key="page.id" :href="`/sites/${siteId}/pages/${page.id}`">
                  {{ page.title }}
              </a>
              <a class="bg-violet-100 rounded hover:bg-violet-200 text-violet-800 p-4" :href="`/sites/${siteId}/pages/new`">
                  + Add Page
              </a>
          </div>
          <Button :disabled="!changesPresent" @click="save">Save</Button>
        </div>
      </div>
      <div v-if="error">
        <h1>Site not found!</h1>
        <p>
          This site could not be found or retrieved. Please check that you're logged in and have
          access to this site.
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import compare from "just-compare";
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Button } from "@/components/ui/button";
  
  const templates = [
    {
      name: "Default",
      value: "default",
    },
    {
      name: "Alternate",
      value: "alternate",
    },
    {
      name: "Single Page App",
      value: "spa",
    },
  ];
  
  const trackedKeys = ["name", "template"] as const;
  
  const siteId = useRoute().params.siteId;
  const sessionId = useSessionKey();
  
  const fetchedSite = ref<{[key in typeof trackedKeys[number]]?: string}>({});
  
  const { data: site, error } = await useFetch(`/api/sites/${siteId}/detail`, {
    headers: {
      Authorization: `Bearer ${sessionId.value}`,
    }
  });
  
  const siteName = computed({
    get: () => site.value?.name ?? "",
    set: (value: string) => {
      if (!site.value) return;
      site.value = { ...site.value, name: value };
    },
  });
  
  const siteTemplate = computed({
    get: () => site.value?.template ?? "",
    set: (value: string) => {
      if (!site.value) return;
      site.value = { ...site.value, template: value };
    },
  });
  
  const changesPresent = computed(
    () =>
      !compare(
        trackedKeys.map((key) => site.value?.[key] ?? ""),
        trackedKeys.map((key) => fetchedSite.value?.[key] ?? "")
      )
  );
  
  const save = async () => {
      const { data, error } = await useFetch(`/api/sites/${siteId}/detail`, {
          method: "PUT",
          body: site.value,
          headers: {
              Authorization: `Bearer ${sessionId.value}`,
          },
      });
  
      if (error.value) {
          console.error(error.value);
      }
  
      if (data.value) {
          fetchedSite.value = {...data.value, name: data.value.name ?? ""};
      }
  }
  
  onMounted(() => {
      fetchedSite.value = {...site.value, name: site.value?.name ?? ""};
  });
  </script>
  
  <style scoped></style>
  