import type { User } from '@canopie-club/prisma-client';

export const useUser = () => useState<User | null>('auth-user', () => null);
export const useSessionKey = (expires?: Date) => useCookie<string>('@canopie-club/session-key', {expires});
export const useLogout = () => {
    const logout = () => {
        const user = useUser();
        const sessionKey = useSessionKey();
        const cookie = useCookie('@canopie-club/session-key', { expires: new Date() });

        user.value = null;
        sessionKey.value = '';
        cookie.value = '';

        $fetch(`/api/auth/logout?sessionKey=${sessionKey.value}`);

        if (window) window.location.reload();
        else navigateTo('/');
    }

    return logout;
}