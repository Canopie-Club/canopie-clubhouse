import { successCatcher } from '#common/server/utils/general'
import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, createError } from 'h3'
import crypto from 'node:crypto'

export default defineEventHandler(async event => {
    /* TODO: THIS SHOULD BE DONE IN ONE QUERY */

    /* ====================================== */
    const sites = await useDrizzle()
        .select()
        .from(tables.sites)

    const allRoutes = []
    for (const site of sites) {
        const routes = await useDrizzle()
            .select()
            .from(tables.routeRecords)
            .where(eq(tables.routeRecords.siteId, site.id))

            allRoutes.push(...routes)

        if (routes.length === 0) {
            const [newRoute] = await useDrizzle().insert(tables.routeRecords).values({
                id: crypto.randomUUID(),
                siteId: site.id,
                domain: 'canopie.club',
                subdomain: site.id
            }).returning()

            allRoutes.push(newRoute)

        }
    }

    /* ====================================== */

    return allRoutes
})
