import { defineEventHandler, createError } from 'h3'
import { getEmailCampaign } from '#common/server/utils/db.emailCampaign'
import { userSite } from '#common/server/utils/db.session'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const siteId = event.context.params?.siteId
  const letterId = event.context.params?.letterId

  if (!siteId) {
    throw createError({ statusCode: 400, message: 'Site ID is required' })
  }

  if (!letterId) {
    throw createError({ statusCode: 400, message: 'Letter ID is required' })
  }

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 401, message: 'Site not found' })
  }

  const result = await getEmailCampaign(letterId)

  return result
})
