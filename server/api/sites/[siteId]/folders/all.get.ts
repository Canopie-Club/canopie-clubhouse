import type { InsertFolder } from '#common/server/types/db'
import { useDrizzle, tables, and, eq, desc } from '#common/server/utils/drizzle'
import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, getRouterParam } from 'h3'
import { createFolder } from '#common/server/utils/db.folder'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const siteId = getRouterParam(event, 'siteId')

  const [site] = await userSite(sessionId, siteId)

  let folders = await useDrizzle()
    .select()
    .from(tables.folders)
    .where(and(eq(tables.folders.siteId, site.id)))
    .orderBy(desc(tables.folders.createdAt))

  if (!folders.length) {
    // Create root folder
    const rootFolder = await createFolder({
      siteId,
      name: 'Home',
      parentId: null,
    } as InsertFolder)

    folders = [rootFolder]
  }

  return folders
})
