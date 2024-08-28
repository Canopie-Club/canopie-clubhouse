import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const pageBody = await readBody(event)
    const sessionId = authHeader.split(' ')[1]
    const siteId = getRouterParam(event, 'siteId')


    if (!siteId) {
        throw createError({statusCode: 400, statusMessage: 'Site ID is required'})
    }

    const site = await userSite(sessionId, siteId)

    if (!site.success) {
        throw createError({statusCode: 401, statusMessage: site.message})
    }

    if (!pageBody.title || !pageBody.path || !pageBody.content) {
        throw createError({statusCode: 400, statusMessage: 'Missing required fields'})
    }

    const [page] = await useDrizzle().insert(tables.pages).values({
        id: uuidv4(),
        siteId: siteId,
        title: pageBody.title,
        path: pageBody.path,
        content: pageBody.content,
    }).returning()

    if (!page) {
        throw createError({statusCode: 500, statusMessage: 'Page not created'})
    }

    return page
})