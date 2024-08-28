export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const sessionId = authHeader.split(' ')[1]
    const siteId = getRouterParam(event, 'siteId')
    const pageId = getRouterParam(event, 'pageId')

    if (!pageId) {
        throw createError({statusCode: 400, statusMessage: 'Page ID is required'})
    }

    if (!siteId) {
        throw createError({statusCode: 400, statusMessage: 'Site ID is required'})
    }

    const site = await userSite(sessionId, siteId, pageId)

    if (!site.success) {
        throw createError({statusCode: 401, statusMessage: site.message})
    }

    const page = site.sites?.flatMap(site => site.pages).find(page => page.id === pageId)

    if (!page) {
        throw createError({statusCode: 404, statusMessage: 'Page not found'})
    }

    await useDrizzle().delete(tables.pages).where(eq(tables.pages.id, pageId))

    return page
})