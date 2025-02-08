<template>
    <Button class="mb-4" variant="link" :size="size" @click="goBack">
        <Icon :name="icon" class="mr-2 h-4 w-4" />
        {{ label }}
    </Button>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";

const router = useRouter();
const route = useRoute();

const props = withDefaults(defineProps<{
    label?: string;
    icon?: string;
    size?: 'sm' | 'md' | 'lg';
    depth?: number;
}>(), {
    label: 'Back',
    icon: 'i-heroicons-arrow-left',
    size: 'sm',
    depth: 1
})

const goBack = () => {
    const path = route.path;
    const pathParts = path.split('/');

    for (let i = 0; i < props.depth; i++) {
        pathParts.pop();
    }

    router.push(pathParts.join('/') || '/');
}

</script>
