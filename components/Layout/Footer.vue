<template>
  <div class="user-bar flex justify-between items-center" :class="[user ? 'logged-in' : 'anon']">
    <!-- <select v-model="locale" @change="changeLocale">
      <option v-for="loc in locales" :key="loc.code" :value="loc.code">
        {{ loc.name }}
      </option>
    </select> -->
    <div></div>

    <div class="w-full max-w-36">
        <Select v-model="language">
          <SelectTrigger>
            <SelectValue placeholder="Select a Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              <SelectItem v-for="loc in locales" :value="loc.code"> {{loc.name || loc.code}} </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
    </div>
  </div>
  <!-- {{ language }} -->
</template>

<script setup lang="ts">
const user = useUser();
const { locale, setLocale, locales } = useI18n();
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const language = computed({
    get: () => locale.value,
    set: (value) => {
        setLocale(value);
    }
});
</script>

<style scoped></style>
