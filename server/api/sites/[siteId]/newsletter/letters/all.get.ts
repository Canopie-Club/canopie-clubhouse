import { defineEventHandler, createError, getQuery } from 'h3'
import { getSiteLetters } from '#common/server/utils/db.session/newsletter'
import { userSite } from '#common/server/utils/db.session'

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

  let { page = 1, pageSize = 10, sortOrder } = getQuery(event)

  if (!['asc', 'desc'].includes(`${sortOrder}`)) {
    sortOrder = undefined
  } else {
    sortOrder = `${sortOrder}` as 'asc' | 'desc'
  }

  const result = await getSiteLetters(siteId, {
    page: Number(page),
    pageSize: Number(pageSize),
    sortOrder: sortOrder as 'asc' | 'desc' | undefined,
  })

  return result
})
