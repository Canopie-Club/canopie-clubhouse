import { defineEventHandler, createError, getRouterParam } from 'h3'
import { Builder } from 'xml2js'

export interface SiteMapUrl {
    loc: string
    lastmod?: string
    changefreq?: string
    priority?: string
    'image:image'?: {
        'image:loc': string
        'image:title': string
    }[]
}

export interface SiteMapUrlset {
    url: SiteMapUrl[]
}

export interface SiteMap {
    urlset: SiteMapUrlset
}

export default defineEventHandler(async event => {
  const siteId = getRouterParam(event, 'siteId')

  if (!siteId) {
    throw createError({ statusCode: 400, statusMessage: 'Site ID is required' })
  }

  const site = await getSite(siteId)

  if (!site) {
    throw createError({ statusCode: 401, statusMessage: 'Site not found' })
  }

  const urls: SiteMapUrl[] = []

  console.log(site)

  const pages = await getSitePages(siteId)

//   const siteUrl = await useDrizzle()
//     .select({domain: tables.routeRecords.domain, subdomain: tables.routeRecords.subdomain})
//     .from(tables.routeRecords)
//     .where(eq(tables.routeRecords.siteId, siteId))
//     .limit(1)

  for (const page of pages) {
    urls.push({
      loc: page.slug,
      lastmod: page.updatedAt.toISOString(),
      changefreq: 'weekly',
      priority: '0.5',
    })
  }

  console.log(urls)

  const sitemap: SiteMap = {
    urlset: {
      url: urls,
    },
  }

  console.log(sitemap)

  const builder = new Builder()
  const xml = builder.buildObject(sitemap)

  console.log(xml)

  setResponseHeader(event, 'Content-Type', 'application/xml')

  await hubBlob().put(`${site.id}/sitemap.xml`, xml, {
    contentType: 'application/xml',
  })

  return xml
})
