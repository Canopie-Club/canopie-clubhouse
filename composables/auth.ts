import type { SiteSummary, User } from '#common/server/types/db'
import { useCookie, useState } from 'nuxt/app'

export const useUser = () => useState<User | null>('auth-user', () => null)
export const useSites = () => useState<SiteSummary[] | null>('auth-sites', () => null)
export const useSessionKey = (expires?: Date) => {
  console.log("SESSION KEY")
  return useCookie<string>('@canopie-club/session-key', {
    expires,
  })
}

export const useLogout = () => {
  return () => {
    const user = useUser()
    const sessionKey = useSessionKey()
    const cookie = useCookie('@canopie-club/session-key', { expires: new Date() })

    user.value = null
    sessionKey.value = ''
    cookie.value = ''

    $fetch(`/api/auth/logout?sessionKey=${sessionKey.value}`)

    if (window) window.location.reload()
    else navigateTo('/')
  }
}