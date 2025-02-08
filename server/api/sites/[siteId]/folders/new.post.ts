import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { createFolder, getSiteRootFolder } from '#common/server/utils/db.folder'
import type { InsertFolder } from '#common/server/types/db'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const { name, parentId } = await readBody(event)
  const siteId = getRouterParam(event, 'siteId')

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 401, statusMessage: 'Site not found' })
  }

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields, name is required',
    })
  }

  const [rootFolder] = await getSiteRootFolder(site.id)

  const folder = await createFolder({
    siteId,
    name: name ?? 'New Folder',
    parentId: parentId ?? rootFolder?.id,
  } as InsertFolder)

  if (!folder) {
    throw createError({ statusCode: 404, statusMessage: 'Folder not found' })
  }

  return folder
})
