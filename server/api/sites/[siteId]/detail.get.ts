import { SiteExtraType } from '~/assets/types/db'
import { getSessionId } from '../../utils/session'

export default defineEventHandler(async (event) => {
    const sessionId = getSessionId(event)
    const siteId = getRouterParam(event, 'siteId')

    if (!siteId) {
        throw createError({ statusCode: 400, statusMessage: 'Site ID is required' })
    }

    const [site] = await userSite(sessionId, siteId)

    if (!site) {
        throw createError({ statusCode: 401, statusMessage: 'Site not found' })
    }

    const extras: SiteExtraType[] = (await useDrizzle().select({ extra: tables.siteExtras.extra })
        .from(tables.siteExtras)
        .where(eq(tables.siteExtras.siteId, site.id))).map(({ extra }) => extra as SiteExtraType)

    const result = {
        ...site,
        extras: extras.filter((extra) => extra !== null),
    }

    return result
})