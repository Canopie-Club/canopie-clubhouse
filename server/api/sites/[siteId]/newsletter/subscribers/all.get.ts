import { defineEventHandler, createError, getQuery } from 'h3'
import { getSiteSubscribers } from '#common/server/utils/db.session/newsletter'
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

  let { page = 1, pageSize = 10, search, sortOrder, sortBy } = getQuery(event)

  if (!['email', 'name'].includes(`${sortBy}`)) {
    sortBy = undefined
  } else {
    sortBy = `${sortBy}` as 'email' | 'name'
  }

  if (!['asc', 'desc'].includes(`${sortOrder}`)) {
    sortOrder = undefined
  } else {
    sortOrder = `${sortOrder}` as 'asc' | 'desc'
  }

  if (typeof search !== 'string') {
    search = undefined
  }

  const result = await getSiteSubscribers(siteId, {
    page: Number(page),
    pageSize: Number(pageSize),
    search,
    sortOrder: sortOrder as 'asc' | 'desc' | undefined,
    sortBy: sortBy as 'email' | 'name' | undefined,
  })

  return result
})
