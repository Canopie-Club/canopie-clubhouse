<template>
    <div class="stepflow-overview">
        <div class="flex gap-2 justify-between">
            <div class="line"></div>
            <div v-for="step in detailedSteps" :key="step.index">
                <div class="step" :class="step.status">
                    <div class="step-icon"></div>
                    <span class="step-name">{{ step.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    steps: string[]
    currentStep: number
}>()

interface StepDetail {
    index: number
    name: string
    status: 'completed' | 'current' | 'upcoming'
}

const detailedSteps = computed<StepDetail[]>(() => {
    return props.steps.map((step, index) => ({
        index,
        name: step,
        status: (index + 1) < props.currentStep ? 'completed' : (index + 1) === props.currentStep ? 'current' : 'upcoming'
    }))
})

</script>

<style lang="scss" scoped>

.stepflow-overview {
    @apply w-full relative;

    .line {
        @apply w-full border-t-2 border-gray-300 absolute top-1/2;
    }

    .step {
        @apply flex items-center gap-2 relative z-10 bg-white p-2 rounded-full;

        .step-icon {
            @apply w-2 h-2 rounded-full bg-gray-300;
        }

        .step-name {
            @apply text-sm text-gray-500;
        }

        &.completed {
            // @apply text-green-500;
            .step-icon {
                @apply bg-green-500;
            }
        }
        &.current {
            // @apply text-blue-500;
            .step-icon {
                @apply bg-gray-500;
            }
        }
        &.upcoming {
            // @apply text-gray-500;
            .step-icon {
                @apply bg-white border-2 border-gray-400;
            }
        }
    }
}

</style>