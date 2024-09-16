import { getSessionId } from '~/server/api/utils/session'

export default defineEventHandler(async (event) => {
    const sessionId = getSessionId(event)
    const siteId = getRouterParam(event, 'siteId')
    const pageId = getRouterParam(event, 'pageId')

    if (!pageId) {
        throw createError({statusCode: 400, statusMessage: 'Page ID is required'})
    }

    if (!siteId) {
        throw createError({statusCode: 400, statusMessage: 'Site ID is required'})
    }

    const result = await successCatcher(async () => await userSite(sessionId, siteId, pageId))

    if (!result.success) {
        throw createError({statusCode: 401, statusMessage: result.message})
    }

    const sites = result.data

    const page = sites?.flatMap(site => site.pages).find(page => page.id === pageId)

    if (!page) {
        throw createError({statusCode: 404, statusMessage: 'Page not found'})
    }

    return page
})