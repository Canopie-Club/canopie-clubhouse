import { defineEventHandler } from 'h3'
import consola from 'consola'

export default defineEventHandler(async event => {
    const { subdomain, domain, pathname } = getQuery(event)
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const clientToken = authHeader.split(' ')[1]

    if (!process.env.CLIENT_TOKEN) {
        consola.warn("CLIENT_TOKEN not defined. This means that the client will not be able to retrieve site/page information.")

        return {
            success: false,
            message: 'CLIENT_TOKEN undefined on server',
            data: null
        }
    }

    if (!clientToken || clientToken !== process.env.CLIENT_TOKEN) {
        return {
            success: false,
            message: 'CLIENT_TOKEN missing or incorrect',
            data: null
        }
    }

    console.log(subdomain, domain, pathname)

    const subdomainIsString = typeof subdomain === 'string'
    const domainIsString = typeof domain === 'string'
    const pathnameIsString = typeof pathname === 'string'

    if (!subdomainIsString || !domainIsString || !pathnameIsString) {
        return {
            success: false,
            message: 'Missing route information',
            data: null
        }
    }

    const [response] = await useDrizzle().select({ site: tables.sites })
        .from(tables.routeRecords)
        .where(and(
            eq(tables.routeRecords.subdomain, subdomain),
            eq(tables.routeRecords.domain, domain)
        ))
        .leftJoin(tables.sites, eq(tables.routeRecords.siteId, tables.sites.id))


    if (!response || !response.site) {
        return {
            success: false,
            message: 'Site not found',
            data: null
        }
    }

    const { site } = response;

    if (site.active !== 1) {
        return {
            success: false,
            message: 'Site not active',
            data: null
        }
    }

    const query = useDrizzle()
        .select()
        .from(tables.pages)

    query.where(eq(
        tables.pages.siteId,
        site.id
    ))

    if (site.template !== 'spa') {
        query.where(eq(
            tables.pages.slug,
            pathname.replace(/^\/*|\/*$/g, '')
        ))
    }

    const pages = await query;

    // console.log(pages)

    return { success: true, message: 'success', data: {site, pages} }
})
