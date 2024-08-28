export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const siteBody = await readBody(event)
    const sessionId = authHeader.split(' ')[1]
    const siteId = getRouterParam(event, 'siteId')

    if (!siteId) {
        throw createError({statusCode: 400, statusMessage: 'Site ID is required'})
    }

    const site = await userSite(sessionId, siteId)
    if (!site.success) {
        throw createError({statusCode: 401, statusMessage: site.message})
    }

    delete siteBody.pages
    delete siteBody.createdAt
    siteBody.updatedAt = new Date()
    
    const [updatedSite] = await useDrizzle().update(tables.sites).set(siteBody).where(eq(tables.sites.id, siteId)).returning()

    return updatedSite
})