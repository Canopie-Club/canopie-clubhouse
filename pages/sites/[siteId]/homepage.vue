<template>
  <div>
    <LayoutPageWrapper :backText="`Back to ${siteId}`">
      <Editor
        ref="editor"
        v-model="content"
        content-mode="html"
        :bordered="true"
        :max-height="'500px'"
      />
      <div class="flex justify-end mt-4">
        <Button :disabled="saveDisabled" @click="save">Save</Button>
      </div>
    </LayoutPageWrapper>
  </div>
</template>

<script setup lang="ts">
import { PageType } from "@canopie-club/toolbox/dist/runtime/common/server/database/enums.js";
import { Button } from "~/components/ui/button";

const { siteId } = useRoute().params;
const pageType = PageType.HOME;
const {
  data: page,
  status,
  error,
} = await useFetch(`/api/sites/${siteId}/pages/type/${pageType}`, headers());

const content = ref(page.value?.content || "");

const saveDisabled = computed(() => {
  return !page.value || content.value === page.value?.content;
});

const save = async () => {
  console.log("content", content.value);
  console.log(`/api/sites/${siteId}/pages/page/${page.value?.id}`);

  const updatedPage = await $fetch(`/api/sites/${siteId}/pages/page/${page.value?.id}`, {
    method: "PUT",
    body: { content: content.value },
    ...headers(),
  });

  console.log("updatedPage", updatedPage);

  page.value = updatedPage;
};
</script>

<style lang="scss" scoped>
:deep(.multiselect) {
  .multiselect__tag {
    @apply bg-amber-500 text-white;

    .multiselect__tag-icon::after {
      @apply text-amber-800 hover:text-amber-100;
    }
  }

  .multiselect__option {
    &.multiselect__option--highlight {
      @apply bg-amber-500 text-white;

      &::after {
        @apply bg-amber-500;
      }

      &.multiselect__option--selected {
        @apply bg-amber-700 text-white;

        &::after {
          @apply bg-amber-700;
        }
      }
    }
  }
}
</style>
