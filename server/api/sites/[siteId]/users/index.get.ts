import type { SiteExtraType } from '#common/server/types/db'
import { useDrizzle, tables, eq } from '#common/server/utils/drizzle'
import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, createError, getRouterParam } from 'h3'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const siteId = getRouterParam(event, 'siteId')

  if (!siteId) {
    throw createError({ statusCode: 400, statusMessage: 'Site ID is required' })
  }

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 401, statusMessage: 'Site not found' })
  }

  const result = await useDrizzle()
    .select()
    .from(tables.siteUsers)
    .where(eq(tables.siteUsers.siteId, site.id))
    .leftJoin(tables.users, eq(tables.siteUsers.userId, tables.users.id))

  return result
})
