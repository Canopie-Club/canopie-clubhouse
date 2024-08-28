import type { Role } from "@canopie-club/prisma-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const sessionKey = useSessionKey();
    const user = useUser();

    if (to.path !== '/login' && !sessionKey.value) {
        return navigateTo('/login')
    }

    if (!user.value && sessionKey.value) {
        const result = await $fetch('/api/auth/verify-session', {
            method: 'POST',
            body: {
                sessionId: sessionKey.value,
            }
        })

        if (!result.success && to.path !== '/login') {
            user.value = null;
            sessionKey.value = '';

            return navigateTo('/login');
        }

        if (result.user) user.value = {
            ...result.user,
            role: result.user.role as Role,
            createdAt: new Date(result.user.createdAt),
            updatedAt: new Date(result.user.updatedAt)
        }
    }

    if (!sessionKey.value) user.value = null;

})