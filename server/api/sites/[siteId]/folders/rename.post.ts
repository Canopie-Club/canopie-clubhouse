import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { updateFolder } from '#common/server/utils/db.folder'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const { name, id } = await readBody(event)
  const siteId = getRouterParam(event, 'siteId')

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 401, statusMessage: 'Site not found' })
  }

  if (!name || !id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields, name and id are required',
    })
  }

  const folder = await updateFolder({ id, name, siteId })

  if (!folder) {
    throw createError({ statusCode: 404, statusMessage: 'Folder not found' })
  }

  return folder
})
