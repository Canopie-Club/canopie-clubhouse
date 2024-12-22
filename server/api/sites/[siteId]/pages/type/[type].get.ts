import { PageTypeArray } from '@canopie-club/toolbox/dist/runtime/common/server/database/enums.js'
import type { PageType, Page } from '@canopie-club/toolbox/dist/runtime/common/server/types/db.js'
import { pascalCase, snakeCase } from 'case-anything'
import crypto from 'node:crypto'

export default defineEventHandler(async (event): Promise<Page> => {
  const sessionId = getSessionId(event)
  const siteId = getRouterParam(event, 'siteId')
  const pageType = getRouterParam(event, 'type') as PageType

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 401, statusMessage: 'Site not found' })
  }

  if (!PageTypeArray.includes(pageType)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid page type' })
  }

  const page = await useDrizzle()
    .select()
    .from(tables.pages)
    .where(
      and(
        eq(tables.pages.siteId, site.id),
        eq(tables.pages.type, pageType)
      )
    );

  if (!page || page.length === 0) {
    const page = await createPage({
      id: crypto.randomUUID(),
      siteId: site.id,
      type: pageType,
      title: pascalCase(pageType),
      slug: snakeCase(pageType),
      content: `<h1>${pascalCase(pageType)}</h1>`,
    })

    return page
  }

  if (page.length > 1) {
    console.warn(`Multiple pages found for type ${pageType} on site ${site.id}`)
  }

  return page[0]
})
