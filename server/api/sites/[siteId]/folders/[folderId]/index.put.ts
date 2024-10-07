import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { updateFolder } from '#common/server/utils/db.folder'
import type { UpdateFolder } from '#common/server/types/db'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const body = await readBody<UpdateFolder>(event)
  const siteId = getRouterParam(event, 'siteId')
  const folderId = getRouterParam(event, 'folderId')

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 401, statusMessage: 'Site not found' })
  }

  if (!folderId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields, id is required' })
  }

  const folder = await updateFolder({ ...body, id: folderId, siteId: site.id })

  if (!folder) {
    throw createError({ statusCode: 404, statusMessage: 'Folder not found' })
  }

  return folder
})
