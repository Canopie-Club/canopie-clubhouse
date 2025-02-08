import type { InsertPage } from '#common/server/types/db'
import { useDrizzle, tables, and, eq, desc } from '#common/server/utils/drizzle'
import { userSite } from '#common/server/utils/db.session'
import { createPage } from '#common/server/utils/db.page'
import { defineEventHandler, getRouterParam } from 'h3'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const siteId = getRouterParam(event, 'siteId')

  console.log(sessionId, siteId)

  const [site] = await userSite(sessionId, siteId)

  let [page] = await useDrizzle()
    .select()
    .from(tables.pages)
    .where(and(eq(tables.pages.siteId, site.id), eq(tables.pages.type, tables.PageType.EPK)))
    .orderBy(desc(tables.pages.createdAt))
    .limit(1)

  if (!page) {
    page = await createPage({
      siteId,
      type: tables.PageType.EPK,
      title: 'EPK',
      slug: 'epk',
    } as InsertPage)
  }

  return page
})
