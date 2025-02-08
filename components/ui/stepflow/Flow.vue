<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6">
    <Overview v-if="Array.isArray(steps)" :steps="steps" :current-step="currentStep" />
    <Progress v-else :model-value="progressValue" class="w-full" />
    <div class="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
      <slot></slot>
    </div>
    <div class="flex justify-between">
      <Button @click="goToPreviousStep" :disabled="currentStep === 1"> {{ previousText }} </Button>
      <Button @click="goToNextStep" :disabled="currentStep === steps || !isNextStepAvailable">
        {{ nextText }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed } from "vue";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Overview } from "~/components/ui/stepflow";

interface FlowProps {
  steps: number | string[];
  nextText?: string;
  previousText?: string;
  onStepChange?: (step: number) => void;
}

const props = withDefaults(defineProps<FlowProps>(), {
  nextText: "Next",
  previousText: "Previous",
  onStepChange: () => {},
});

const currentStep = ref(1);
const stepAvailability = ref<Record<number, boolean>>({});
const beforeChanges = ref<Record<number, () => Promise<boolean>>>({});

const totalSteps = computed(() =>
  typeof props.steps === "number" ? props.steps : props.steps.length
);

const goToNextStep = async () => {
  const goOn = await beforeChanges.value[currentStep.value]?.();
  if (!goOn) return;
  currentStep.value = Math.min(currentStep.value + 1, totalSteps.value);
  props.onStepChange(currentStep.value);
};

const goToPreviousStep = () => {
  currentStep.value = Math.max(currentStep.value - 1, 1);
  props.onStepChange(currentStep.value);
};

const setStepAvailability = (step: number, available: boolean) => {
  stepAvailability.value[step] = available;
};

const setBeforeChangeFunction = (step: number, changeFunction: () => Promise<boolean>) => {
  beforeChanges.value[step] = changeFunction;
};

const nextStepExists = computed(() => currentStep.value < totalSteps.value);

const isNextStepAvailable = computed(() => nextStepExists.value && stepAvailability.value[currentStep.value + 1] !== false);

const progressValue = computed(() => ((currentStep.value - 1) / (totalSteps.value - 1)) * 100);

provide("FlowContext", {
  currentStep,
  goToNextStep,
  goToPreviousStep,
  setStepAvailability,
  setBeforeChangeFunction,
});

defineExpose({currentStep})
</script>
