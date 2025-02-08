import { hubBlob } from '@nuxthub/core/dist/runtime/blob/server/utils/blob'
import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async event => {
  const siteId = event.context.params?.siteId
  if (!siteId) {
    throw createError({ statusCode: 400, message: 'No siteId provided' })
  }

  const sessionId = getSessionId(event)
  const [site] = await userSite(sessionId, siteId)
  if (!site) {
    throw createError({ statusCode: 400, message: 'Site not found' })
  }

  return hubBlob().list({ prefix: siteId + '/', folded: true })
})
