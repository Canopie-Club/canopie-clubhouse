import { successCatcher } from '#common/server/utils/general'
import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, getRouterParam, createError } from 'h3'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const siteId = getRouterParam(event, 'siteId')
  const pageId = getRouterParam(event, 'pageId')
  const query = getQuery(event)

  if (!pageId) {
    throw createError({ statusCode: 400, statusMessage: 'Page ID is required' })
  }

  if (!siteId) {
    throw createError({ statusCode: 400, statusMessage: 'Site ID is required' })
  }

  const result = await successCatcher(async () => await userSite(sessionId, siteId, pageId))

  if (!result.success) {
    throw createError({ statusCode: 401, statusMessage: result.message })
  }

  const sites = result.data

  const page = sites?.flatMap(site => site.pages).find(page => page.id === pageId)

  if (!page) {
    const createMissingPage = query.createPage === 'true';
    if (!createMissingPage) throw createError({ statusCode: 404, statusMessage: 'Page not found' })

    const page = await createPage({
      id: pageId,
      siteId: siteId,
      title: pageId,
      slug: pageId,
      content: '',
    })
    
    return page
  }

  return page
})
