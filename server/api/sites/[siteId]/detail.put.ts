import { getSessionId } from '../../utils/session'

export default defineEventHandler(async (event) => {
    const sessionId = getSessionId(event)
    const siteBody = await readBody(event)
    const siteId = getRouterParam(event, 'siteId')

    if (!siteId) {
        throw createError({statusCode: 400, statusMessage: 'Site ID is required'})
    }

    const [site] = await userSite(sessionId, siteId)

    if (!site) {
        throw createError({statusCode: 401, statusMessage: 'Site not found'})
    }

    delete siteBody.pages
    delete siteBody.createdAt
    siteBody.updatedAt = new Date()
    
    const [updatedSite] = await useDrizzle().update(tables.sites).set(siteBody).where(eq(tables.sites.id, siteId)).returning()

    return updatedSite
})