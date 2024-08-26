<template>
    <div>
      <div v-if="page">
        <Button class="mb-4" variant="outline" @click="goBack">
          <- Back
        </Button>
        <h1 class="mb-4">{{ page.title }}</h1>
        <div class="flex flex-col gap-4">
          <UiInput v-model="pageTitle" />
          <UiInput v-model="pageRoute" />
          <Textarea v-model="pageContent" />
          <Button :disabled="!changesPresent" @click="save">Save</Button>
          <Button variant="destructive" @click="deletePage">Delete</Button>
        </div>
      </div>
      <div v-else>
        <div class="flex flex-col gap-4">
          <UiInput v-model="newPage.title" placeholder="Page Title" />
          <UiInput v-model="newPage.path" placeholder="Page Route" />
          <Textarea v-model="newPage.content" placeholder="Page Content" />
          <Button :disabled="!(newPage.title && newPage.path && newPage.content)" @click="saveNew">Save</Button>
        </div>
      </div>
      <div v-if="error">
        <h1>Page not found!</h1>
        <p>
          This page could not be found or retrieved. Please check that you're logged in and have
          access to the page.
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import compare from "just-compare";
  import { Textarea } from '@/components/ui/textarea'
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
  
  const trackedKeys = ["title", "path", "content"] as const;
  
  const route = useRoute();
  const router = useRouter();
  const pageId = route.params.pageId;
  const siteId = route.params.siteId;
  const sessionId = useSessionKey();

  const goBack = () => {
    router.push(`/sites/${siteId}`);
  }
  
  const newPage = ref<{[key in typeof trackedKeys[number]]?: string}>({});
  const fetchedPage = ref<{[key in typeof trackedKeys[number]]?: string}>({});
  
  const { data: page, error, refresh } = await useFetch(pageId === "new" ? `/api/sites/${siteId}/pages/new` : `/api/sites/${siteId}/pages/page/${pageId}`, {
    headers: {
      Authorization: `Bearer ${sessionId.value}`,
    }
  });
  
  const pageTitle = computed({
    get: () => page.value?.title ?? "",
    set: (value: string) => {
      if (!page.value) return;
      page.value = { ...page.value, title: value };
    },
  });

  const pageRoute = computed({
    get: () => page.value?.path ?? "",
    set: (value: string) => {
      if (!page.value) return;
      page.value = { ...page.value, path: value };
    },
  });

  const pageContent = computed({
    get: () => page.value?.content ?? "",
    set: (value: string) => {
      if (!page.value) return;
      page.value = { ...page.value, content: value };
    },
  });
  
  const changesPresent = computed(
    () =>
      !compare(
        trackedKeys.map((key) => page.value?.[key] ?? ""),
        trackedKeys.map((key) => fetchedPage.value?.[key] ?? "")
      )
  );
  
  const save = async () => {
      const { data, error } = await useFetch(`/api/sites/${siteId}/pages/page/${pageId}`, {
          method: "PUT",
          body: page.value,
          headers: {
              Authorization: `Bearer ${sessionId.value}`,
          },
      });
  
      if (error.value) {
          console.error(error.value);
      }
  
      if (data.value) {
          fetchedPage.value = {...data.value, title: data.value.title ?? ""};
      }
  }

  const deletePage = async () => {
    const { data, error } = await useFetch(`/api/sites/${siteId}/pages/page/${pageId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionId.value}`,
        },
    });

    router.push(`/sites/${siteId}`);
  }
  
  const saveNew = async () => {
      const { data, error } = await useFetch(`/api/sites/${siteId}/pages/new`, {
          method: "POST",
          body: {
            ...newPage.value,
            siteId: siteId
          },
          headers: {
              Authorization: `Bearer ${sessionId.value}`,
          },
      });
  
      if (error.value) {
          console.error(error.value);
      }

      router.push(`/sites/${siteId}/pages/${data.value?.id}`);
  }
  
  onMounted(() => {
      fetchedPage.value = {...page.value, title: page.value?.title ?? ""};
  });
  </script>
  
  <style scoped></style>
  