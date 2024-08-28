export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const sessionId = authHeader.split(' ')[1]
    const siteId = getRouterParam(event, 'siteId')

    if (!siteId) {
        throw createError({statusCode: 400, statusMessage: 'Site ID is required'})
    }

    const site = await userSite(sessionId, siteId)

    if (!site.success) {
        throw createError({statusCode: 401, statusMessage: site.message})
    }

    if (!site.sites || site.sites.length === 0) {
        throw createError({statusCode: 404, statusMessage: 'Site not found'})
    }
    
    return site.sites[0]
})