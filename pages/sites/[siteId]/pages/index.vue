<template>
  <UPageBody>
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UiCardLink v-for="(module, index) in navigation" :key="index" v-bind="module">
        </UiCardLink>
      </div>

      <PageError
        v-if="error"
        :code="error.statusCode"
        name="Site not found!"
        message="Please check that you're logged in and have access to this site."
      >
      </PageError>
    </UContainer>
  </UPageBody>
</template>

<script setup lang="ts">
import compare from "just-compare";
import { PageError } from "~/components/ui/custom";

const siteId = useRoute().params.siteId;
const sessionId = useSessionKey();

const fetchedSite = ref<{ [key in (typeof trackedKeys)[number]]?: string }>({});

const {
  data: site,
  error,
  pending: loading,
} = await useFetch(`/api/sites/${siteId}/detail`, {
  headers: {
    Authorization: `Bearer ${sessionId.value}`,
  },
});

const globalNavigation = useNavigation();
const navigation = computed((): SiteLinkTree[] => {
  const siteItems = (globalNavigation.value.find((item) => item.to === `/sites/${siteId}`)
    ?.children || []) as SiteLinkTree[];
  return (siteItems.find((item) => item.title === "Pages")?.children || []) as SiteLinkTree[];
});

const modules = [
  // ...(sites.value || []).map((site) => ({
  //   title: site.name ?? "Untitled Site",
  //   description: `Review or edit the ${site.name} site.`,
  //   icon: "i-heroicons-map",
  //   to: `/sites/${site.id}`,
  // })),
  // {
  //   title: "Account",
  //   description: "Edit your account information.",
  //   to: "/account/profile",
  //   icon: "i-heroicons-user",
  // },
  // {
  //   title: "Settings",
  //   description: "Edit your account settings.",
  //   to: "/account/settings",
  //   icon: "i-heroicons-cog",
  // },
];

const trackedKeys = ["name", "template"] as const;

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
    fetchedSite.value = { ...data.value, name: data.value.name ?? "" };
  }
};

onMounted(() => {
  fetchedSite.value = { ...site.value, name: site.value?.name ?? "" };

  console.log(fetchedSite.value)
});
</script>

<style scoped></style>
