<template>
  <Flow
    :steps="['Site Info', 'Extras', 'Confirmation', 'Finished']"
    :next-text="nextStepText"
    @step-change="onStepChange"
  >
    <Step :step-number="1" :before-next="checkSiteInfo">
      <h2 class="text-2xl font-bold mb-4">Project Info</h2>
      <form @submit.prevent="submitSiteInfo" class="space-y-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>The name of your project</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="siteId">
          <FormItem>
            <FormLabel>The site ID</FormLabel>
            <FormDescription class="text-xs">
              This is the URL of your site on canopie.club (e.g.
              <span class="font-mono">[site-id].canopie.club</span>). If you plan on purchasing a
              domain name, or have already, this does not have to be the same as that domain
              name.<br />
              It must be unique and cannot be changed later.
            </FormDescription>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="siteType">
          <FormItem>
            <FormLabel>This site is for a…</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a site type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="type in siteTypeArray" :key="type" :value="type">
                  {{ siteTypeNames[type] }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
    </Step>

    <Step :step-number="2" :is-available="siteInfoReady">
      <h2 class="text-2xl font-bold mb-4">Extras</h2>
      <p class="text-sm text-stone-600">
        Please select the add-ons that you want to include in your site package. Each add-on costs
        an additional $1/month* (you can also add or remove these at a later).
      </p>

      <div class="flex flex-col gap-4 py-4">
        <div class="flex items-center space-x-2">
          <Checkbox
            id="newsletter"
            :checked="extras.NEWSLETTER"
            @update:checked="(checked) => (extras.NEWSLETTER = checked)"
          />
          <Label for="newsletter">Newsletter / Mailing List</Label>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox
            id="eventTicketing"
            :checked="extras.EVENT_TICKETING"
            @update:checked="(checked) => (extras.EVENT_TICKETING = checked)"
          />
          <Label for="eventTicketing">Event Ticketing</Label>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox
            id="blog"
            :checked="extras.BLOG"
            :disabled="true"
            @update:checked="(checked) => (extras.BLOG = checked)"
          />
          <Label for="blog">Blog</Label>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox
            id="shop"
            :checked="extras.SHOP"
            :disabled="true"
            @update:checked="(checked) => (extras.SHOP = checked)"
          />
          <Label for="shop">Shop</Label>
        </div>
      </div>
      <!-- <Input id="name" v-model="name" placeholder="Enter your name" class="mt-1" /> -->
    </Step>

    <Step :step-number="3" :is-available="true">
      <h2 class="text-2xl font-bold mb-4">Confirmation</h2>

      <div class="my-4">
        <InfoSiteSummary :site-info="siteInfoForm.values" :extras="extras" />
      </div>

      <p class="text-sm text-gray-600 my-4">
        Please read our terms and conditions before proceeding. By checking this box, you
        acknowledge that you have read and agree to our terms of service.
      </p>
      <!-- <p class="text-sm text-gray-600 my-4">
        In proceeding, you will be brought to a billing page before creating your site.
      </p> -->
      <div class="flex items-center space-x-2">
        <Checkbox
          id="terms"
          :checked="agreeTerms"
          @update:checked="(checked) => (agreeTerms = checked)"
        />
        <Label for="terms">
          I agree to the
          <NuxtLink to="/terms" target="_blank" class="text-blue-600 hover:underline">
            terms and conditions
          </NuxtLink>
        </Label>
      </div>
    </Step>

    <Step :step-number="4" :is-available="agreeTerms">
      <h2 class="text-2xl font-bold mb-4">
        {{ siteCreationFinished ? "Finished!" : "Nearly There!" }}
      </h2>
      <div class="space-y-4">
        <template v-if="!siteCreationFinished">
          <div class="flex flex-col items-center justify-center">
            <UiSpinner />
            <p class="text-sm text-gray-600">Creating your site...</p>
          </div>
        </template>
        <template v-else>
          <div class="text-center">
            <Icon name="heroicons:check-circle" class="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 class="text-xl font-semibold mb-2">Thank You!</h3>
            <p class="text-gray-600 mb-4">Your site has been successfully created.</p>
            <NuxtLink to="/sites/{{ siteInfoForm.values.siteId }}" class="mt-2">
              <Button @click="" class="mt-2">Go to Dashboard</Button>
            </NuxtLink>
          </div>
        </template>
      </div>
    </Step>
  </Flow>
</template>

<script setup lang="ts">
import { Flow, Step } from "~/components/ui/stepflow";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import type { SiteExtraType } from "#common/server/types/db";
// import { Spinner } from "~/components/ui/custom";

import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
// import { Spinner } from "radix-vue"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";

const siteTypeArray = ["MUSICIAN", "RECORD_LABEL", "COMEDIAN", "VISUAL_ARTIST"] as SiteType[];

const siteTypeNames = {
  MUSICIAN: "Musician",
  RECORD_LABEL: "Record Label",
  COMEDIAN: "Comedian",
  VISUAL_ARTIST: "Visual Artist",
};

const siteInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  siteId: z
    .string()
    .min(2, "Site ID must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Site ID must contain only lowercase letters, numbers, and hyphens"),
  siteType: z.enum(siteTypeArray as [string, ...string[]]),
});

// type SiteInfo = z.infer<typeof siteInfoSchema>

const siteInfoForm = useForm({
  validationSchema: toTypedSchema(siteInfoSchema),
});

const siteInfoReady = computed(() => {
  const { name, siteId } = siteInfoForm.values;
  return !!name && !!siteId;
});

const checkSiteInfo = async () => {
  const result = await siteInfoForm.validate();
  // TODO: Check that the siteId isn't already taken
  return result.valid;
};

const submitSiteInfo = siteInfoForm.handleSubmit((values) => {
  console.log(values);
});

const extras = ref<{
  [key in SiteExtraType]: boolean;
}>({
  NEWSLETTER: false,
  EVENT_TICKETING: false,
  BLOG: false,
  SHOP: false,
});

const agreeTerms = ref(false);

const nextStepText = ref("Next");

const createSite = async () => {
  const result = await siteInfoForm.validate();
  if (!result.valid) {
    return;
  }

  const siteExtras: SiteExtraType[] = ["NEWSLETTER", "EVENT_TICKETING", "BLOG", "SHOP"].filter(
    (extra) => extras.value[extra as SiteExtraType]
  ) as SiteExtraType[];

  console.log(result.values, siteExtras);

  const site = await $fetch("/api/sites/create", {
    method: "PUT",
    body: {
      ...result.values,
      extras: siteExtras,
    },
    ...headers(),
  });

  if (site.success) {
    siteCreationFinished.value = true;
  }

  console.log(site);
};

const onStepChange = (step: number) => {
  if (nextStepText.value === "Next" && step < 3) return;
  if (nextStepText.value === "Create Site" && step === 3) return;
  if (step === 3) {
    nextStepText.value = "Create Site";
  } else if (step === 4) {
    createSite();
    nextStepText.value = "Finished";
  } else {
    nextStepText.value = "Next";
  }
};

const siteCreationFinished = ref(false);
</script>
