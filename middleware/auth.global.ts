import type { RoleType } from '~/assets/types/db';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const sessionKey = useSessionKey();
    const user = useUser();
    const sites = useSites();

    if (to.path !== '/login' && !sessionKey.value) {
        return navigateTo(`/login?redirect=${to.path}`)
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
            sites.value = null;
            sessionKey.value = '';

            return navigateTo('/login');
        }

        if (result.user) user.value = {
            ...result.user,
            role: result.user.role as RoleType,
            createdAt: new Date(result.user.createdAt),
            updatedAt: new Date(result.user.updatedAt)
        }

        if (result.sites) sites.value = result.sites;
    }

    if (!sessionKey.value) user.value = null;

})