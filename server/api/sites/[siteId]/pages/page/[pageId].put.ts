export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const pageBody = await readBody(event)
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

    delete pageBody.users;
    delete pageBody.pages;

    const [updatedPage] = await useDrizzle().update(tables.pages).set({
        id: pageBody.id,
        title: pageBody.title,
        path: pageBody.path,
        content: pageBody.content,
        createdAt: new Date(pageBody.createdAt),
        updatedAt: new Date(),
    }).where(eq(tables.pages.id, pageId)).returning()
    
    return updatedPage
})