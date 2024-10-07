import crypto from 'node:crypto'
import { userSite } from '#common/server/utils/db.session'
import { createPage } from '#common/server/utils/db.page'
import { defineEventHandler, createError, readBody, getRouterParam } from 'h3'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const pageBody = await readBody(event)
  const siteId = getRouterParam(event, 'siteId')

  if (!siteId) {
    throw createError({ statusCode: 400, statusMessage: 'Site ID is required' })
  }

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 401, statusMessage: 'Site not found' })
  }

  if (!pageBody.title || !pageBody.path || !pageBody.content) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const page = await createPage({
    id: crypto.randomUUID(),
    siteId: siteId,
    title: pageBody.title,
    slug: pageBody.path,
    content: pageBody.content,
  })

  if (!page) {
    throw createError({ statusCode: 500, statusMessage: 'Page not created' })
  }

  return page
})
