<template>
  <UPageBody>
    <UContainer>
      <h1 class="text-2xl font-bold mb-4">Contact Form</h1>
      <div v-if="page" class="grid grid-cols-2 gap-4">
        <UFormGroup label="Page Title" name="title">
            <UInput v-model="page.title" class="col-span-2 md:col-span-1" />
        </UFormGroup>

        <UFormGroup label="Page Path" name="slug">
            <UInput v-model="page.slug" class="col-span-2 md:col-span-1" />
        </UFormGroup>

        <UTextarea label="Description" v-model="page.content" placeholder="Say something to introduce your contact form" class="col-span-2" />

        <hr class="col-span-2" />

        <div class="grid grid-cols-3 gap-4 col-span-2 items-center justify-center">
          <div class="text-lg font-bold col-span-3 text-gray-500">Fields</div>
          <template v-for="field in fields" :key="field.label">
            <UInput label="Label" v-model="field.label" class="col-span-2 md:col-span-1" />
            <USelect
              label="Type"
              v-model="field.type"
              :options="[...formOptions]"
              class="col-span-2 md:col-span-1"
            />
            <div class="flex items-center gap-4 col-span-2 md:col-span-1">
              <UCheckbox label="Required" v-model="field.required" />
              <UCheckbox v-if="/\bname\b/i.test(field.label)" label="First & Last" v-model="field.splitFirstLast" class="col-span-2 md:col-span-1" />
            </div>
          </template>
        </div>

        <hr class="col-span-2" />

        <Multiselect
          v-model="fields"
          :options="options"
          placeholder="Add field"
          :custom-label="customLabel"
          :multiple="true"
          :taggable="true"
          track-by="label"
          @tag="addTag"
          class="col-span-2"
        />
      </div>


      <!-- <LayoutDebug :items="[page, status, error]" /> -->
      
    </UContainer>
  </UPageBody>
</template>

<script setup lang="ts">
import "vue-multiselect/dist/vue-multiselect.css";
import Multiselect from "vue-multiselect";
import clone from "just-clone";

const formFieldTypes = ['text', 'email', 'textarea', 'select', 'checkbox', 'radio'] as const
const formOptions = [...formFieldTypes]

// type FieldType = (typeof formFieldTypes)[number];

// interface Field {
//   label: string;
//   type: FieldType;
//   options?: { label: string; value: string }[];
//   required?: boolean;
//   splitFirstLast?: boolean;
// }

const { siteId } = useRoute().params;
const { data: page, status, error } = await useFetch(`/api/sites/${siteId}/pages/contact-form`, headers());

const fields = computed({
  get: () => {
    return (page.value?.options as PageContactOptions)?.form?.fields || [];
  },
  set: (newFields: FormField[]) => {
    if (!page.value) return;
    const options = clone(page.value.options) as PageContactOptions;
    options.form = { ...options.form, fields: newFields } as Form;
    page.value.options = options;
  }
});

const options = ref([
  { label: "Name", type: "text", splitFirstLast: true },
  { label: "Email", type: "email" },
  { label: "Phone", type: "text" },
  { label: "Message", type: "textarea" },
] as FormField[]);

const customLabel = (item: any) => {
  return item.label;
};

const addTag = (newTag: any) => {
  const field = { label: newTag, type: "text" } as FormField;
  options.value.push(field);
  fields.value.push(field);
};

watch(fields, (newVal) => {
  if (!page.value) return;
  // const options = clone(page.value.options) as PageContactOptions;
  // // @ts-ignore
  // options.form = {fields: newVal};
  // page.value.options = options;
});

onMounted(() => {
    if (typeof formFieldTypes !== 'undefined') {
        console.log(formFieldTypes);
    } else {
        console.log("formFieldTypes is undefined");
    }
});
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
