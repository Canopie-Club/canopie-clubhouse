import { useDrizzle, tables, eq } from '#common/server/utils/drizzle'
import { successCatcher } from '#common/server/utils/general'
import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const pageBody = await readBody(event)
  const siteId = getRouterParam(event, 'siteId')
  const pageId = getRouterParam(event, 'pageId')

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
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  delete pageBody.users
  delete pageBody.pages

  console.log('pageBody', pageBody)

  const [updatedPage] = await useDrizzle()
    .update(tables.pages)
    .set({
      id: pageBody.id || page.id,
      title: pageBody.title || page.title,
      slug: pageBody.path || page.slug,
      content: pageBody.content || page.content,
      createdAt: new Date(pageBody.createdAt || page.createdAt),
      updatedAt: new Date(),
    })
    .where(eq(tables.pages.id, pageId))
    .returning()

  return updatedPage
})
