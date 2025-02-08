<template>
  <div>
    <template v-if="hiddenMode === 'v-if'">
      <div v-show="currentStep === props.stepNumber">
        <slot></slot>
      </div>
    </template>
    <template v-else>
      <div v-show="currentStep === props.stepNumber">
        <slot></slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, inject, type Ref } from "vue";

interface StepProps {
  stepNumber: number;
  isAvailable?: boolean;
  isComplete?: boolean;
  hiddenMode?: 'v-if' | 'v-show'
  beforeNext?: () => Promise<boolean>;
}

const props = withDefaults(defineProps<StepProps>(), {
  isAvailable: true,
  hiddenMode: 'v-show'
});

const { currentStep, setStepAvailability, setBeforeChangeFunction } = inject("FlowContext") as {
  currentStep: Ref<number>;
  setStepAvailability: (step: number, available: boolean) => void;
  setBeforeChangeFunction: (step: number, changeFunction: () => Promise<boolean>) => void
};

watch(props, () => {
  setStepAvailability(props.stepNumber, props.isAvailable);
  setBeforeChangeFunction(props.stepNumber, props.beforeNext || (async () => true))
})

onMounted(() => {
  setStepAvailability(props.stepNumber, props.isAvailable);
  setBeforeChangeFunction(props.stepNumber, props.beforeNext || (async () => true))
});
</script>
