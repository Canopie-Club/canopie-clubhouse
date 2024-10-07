import { defineEventHandler, createError, getQuery } from 'h3'
import { getSiteSubscribers, userSite } from '#common/server/utils/db.session'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const siteId = event.context.params?.siteId

  if (!siteId) {
    throw createError({ statusCode: 400, message: 'Site ID is required' })
  }

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 401, message: 'Site not found' })
  }

  const { page = 1, pageSize = 10 } = getQuery(event)

  const result = await getSiteSubscribers(siteId, {
    page: Number(page),
    pageSize: Number(pageSize),
  })

  return result
})
