<template>
  <div
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

          <!-- <Select v-model="language">
            <SelectTrigger>
              <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Languages</SelectLabel>
                <SelectItem
                  v-for="loc in locales"
                  :value="loc.code"
                  :key="loc.code"
                >
                  {{ loc.name || loc.code }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select> -->
        </div>
      </div>
    </UContainer>
  </div>
  <!-- {{ language }} -->
</template>

<script setup lang="ts">
const user = useUser();
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
  @apply bg-gray-50 border-t-2 border-gray-100;
}
</style>
