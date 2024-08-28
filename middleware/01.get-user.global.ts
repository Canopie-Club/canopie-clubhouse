import type { Role } from "@canopie-club/prisma-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const sessionKey = useSessionKey();
  const user = useUser();

  if (!user.value && sessionKey.value) {
      const result = await $fetch('/api/auth/verify-session', {
          method: 'POST',
          body: {
              sessionId: sessionKey.value,
          }
      })

      if (!result.success) {
          user.value = null;
          sessionKey.value = '';
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