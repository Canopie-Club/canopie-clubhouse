import { userSite } from '#common/server/utils/db.session'
import { prepareSitePathname, renameBlobs } from '#common/server/utils/r1.blob'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async event => {
  let { oldPath, newPath, directory } = await readBody(event)

  directory = directory ?? false

  const sessionId = getSessionId(event)
  const siteId = event.context.params?.siteId

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 400, message: 'Site not found' })
  }

  if (!oldPath || !newPath) {
    throw createError({ statusCode: 400, message: 'Path not found' })
  }

  oldPath = prepareSitePathname(site.id, oldPath, directory)
  newPath = prepareSitePathname(site.id, newPath, directory)

  return await renameBlobs(oldPath, newPath, directory)
})
