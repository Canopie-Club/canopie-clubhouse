<template>
    <div>
      <RouteBack />
      <div v-if="page">
        <h1 class="mb-4">{{ page.title }}</h1>
        <div class="flex flex-col gap-4">
          <UiInput v-model="pageTitle" />
          <UiInput v-model="pageRoute" />
          <!-- <UiTextarea rows="10" v-model="pageContent" /> -->

          <Editor ref="editor" :site-id="siteId" v-model="pageContent" content-mode="html" :bordered="true" :max-height="'500px'" />
          <UiButton block color="amber" :disabled="!changesPresent" @click="save">Save</UiButton>
          <UiButton block color="rose" @click="deletePage">Delete</UiButton>
        </div>
      </div>
      <div v-else>
        <div class="flex flex-col gap-4">
          <UiInput v-model="newPage.title" placeholder="Page Title" />
          <UiInput v-model="newPage.slug" placeholder="Page Route" />
          <UiTextarea rows="10" v-model="newPage.content" placeholder="Page Content" />
          <UiButton :disabled="!(newPage.title && newPage.slug)" @click="saveNew">Save</UiButton>
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
import Editor from '~/components/Editor/Editor.vue';
  
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
  
  const trackedKeys = ["title", "slug", "content"] as const;
  
  const route = useRoute();
  const router = useRouter();
  const pageId = route.params.pageId;
  const siteId = route.params.siteId as string;
  const sessionId = useSessionKey();
  
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
    get: () => page.value?.slug ?? "",
    set: (value: string) => {
      if (!page.value) return;
      page.value = { ...page.value, slug: value };
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
      const data = await $fetch(`/api/sites/${siteId}/pages/page/${pageId}`, {
          method: "PUT",
          body: page.value,
          headers: {
              Authorization: `Bearer ${sessionId.value}`,
          },
      });
  
      if (error.value) {
          console.error(error.value);
      }
  
      if (data) {
          console.log(data);
          fetchedPage.value = {...data, title: data.title ?? ""};
      }
  }

  const deletePage = async () => {
    const data = await $fetch(`/api/sites/${siteId}/pages/page/${pageId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionId.value}`,
        },
    });

    router.push(`/sites/${siteId}`);
  }
  
  const saveNew = async () => {
      const data = await $fetch(`/api/sites/${siteId}/pages/new`, {
          method: "POST",
          body: {
            ...newPage.value,
            content: newPage.value.content ?? "",
            siteId: siteId
          },
          headers: {
              Authorization: `Bearer ${sessionId.value}`,
          },
      });
  
      if (error.value) {
          console.error(error.value);
      }

      router.push(`/sites/${siteId}/site/pages/${data?.id}`);
  }
  
  onMounted(() => {
      fetchedPage.value = {...page.value, title: page.value?.title ?? ""};
  });
  </script>
  
  <style scoped></style>
  