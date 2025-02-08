<template>
  <!-- <div
    class="footer-bar flex justify-between items-center"
    :class="[user ? 'logged-in' : 'anon']"
  >
    <UContainer class="w-full">
      <div class="w-full flex justify-between items-center">
        <div></div>
        <div class="w-full max-w-36">
          <USelectMenu
            v-model="language"
            :options="locales"
            option-attribute="name"
            value-attribute="code"
            placeholder="Select a Language"
          ></USelectMenu>
        </div>
      </div>
    </UContainer>
  </div> -->
  
  <UFooter class="">
      <!-- {{ language }} -->
      <template #right>
        <USelectMenu
          v-model="language"
          :options="locales"
          option-attribute="name"
          value-attribute="code"
          placeholder="Select a Language"
        ></USelectMenu>
      </template>
    </UFooter>
</template>

<script setup lang="ts">
const { locale, setLocale, locales } = useI18n();

const language = computed({
  get: () => locale.value,
  set: (value) => {
    setLocale(value);
  },
});
</script>

<style lang="scss" scoped>
.footer-bar {
  @apply border-gray-100 border-t-2;
  // @apply bg-gray-50 border-t-2 border-gray-100;
}
</style>
