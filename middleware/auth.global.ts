import type { RoleType } from '#common/server/types/db';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const ignorePatterns = [/^\/_nuxt/]

    if (ignorePatterns.some(pattern => pattern.test(to.path))) return;

    const sessionKey = useSessionKey();
    const user = useUser();
    const sites = useSites();

    const allowedRoutes = ['/login', '/signup', '/stepflow'];

    if (!allowedRoutes.includes(to.path) && !sessionKey.value) {
        return navigateTo(`/login?redirect=${to.path}`)
    }

    if (!user.value && sessionKey.value) {
        const result = await $fetch('/api/auth/verify-session', {
            method: 'POST',
            body: {
                sessionId: sessionKey.value,
            }
        })

        if (!result.success && !allowedRoutes.includes(to.path)) {
            user.value = null;
            sites.value = null;
            sessionKey.value = '';

            return navigateTo('/login');
        }

        if (result.user) {
            user.value = {
                ...result.user,
                role: result.user.role as RoleType,
                createdAt: new Date(result.user.createdAt),
                updatedAt: new Date(result.user.updatedAt)
            }
        }

        if (result.sites) {
            sites.value = result.sites;
        }
    }

    if (!sessionKey.value) {
        user.value = null;
        sites.value = null;
        sessionKey.value = '';
    }

})