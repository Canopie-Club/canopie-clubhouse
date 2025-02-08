<script setup lang="ts">
import { ref } from 'vue'
import { Flow, Step } from "~/components/ui/stepflow"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox"

const name = ref('')
const agreeTerms = ref(false)
</script>

<template>
  <Flow :steps="4">
    <Step :step-number="1">
      <h2 class="text-2xl font-bold mb-4">Welcome</h2>
      <p>This is a multi-step flow. Click Next to continue.</p>
    </Step>

    <Step :step-number="2">
      <h2 class="text-2xl font-bold mb-4">Enter Your Name</h2>
      <Label for="name">Name</Label>
      <Input
        id="name"
        v-model="name"
        placeholder="Enter your name"
        class="mt-1"
      />
    </Step>

    <Step :step-number="3" :is-available="name.length > 0">
      <h2 class="text-2xl font-bold mb-4">Terms and Conditions</h2>
      <div class="flex items-center space-x-2">
        <Checkbox id="terms" v-model="agreeTerms" />
        <Label for="terms">I agree to the terms and conditions</Label>
      </div>
    </Step>

    <Step :step-number="4" :is-available="agreeTerms">
      <h2 class="text-2xl font-bold mb-4">Confirmation</h2>
      <p>Thank you, {{ name }}! Your registration is complete.</p>
    </Step>
  </Flow>
</template>