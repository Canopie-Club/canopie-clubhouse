import type { InsertPage } from '#common/server/types/db'
import { useDrizzle, tables, and, eq, desc } from '#common/server/utils/drizzle'
import { userSite, getUserFromSession } from '#common/server/utils/db.session'
import type { PageContactOptions } from '#common/server/types/db.page'
import { createPage, getPage } from '#common/server/utils/db.page'
import { defineEventHandler, getRouterParam } from 'h3'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const siteId = getRouterParam(event, 'siteId')

  console.log(sessionId, siteId)

  const [site] = await userSite(sessionId, siteId)

  const user = await getUserFromSession(sessionId)

  let [page] = await useDrizzle()
    .select()
    .from(tables.pages)
    .where(and(eq(tables.pages.siteId, site.id), eq(tables.pages.type, tables.PageType.CONTACT)))
    .orderBy(desc(tables.pages.createdAt))
    .limit(1)

  if (!page) {
    const slugBase = 'contact-form'
    let slug = slugBase
    let slugCounter = 0
    let slugExists = true

    while (slugExists) {
      const [existingPage] = await getPage({ siteId: site.id, slug })
      if (existingPage) {
        slugCounter++
        slug = `${slugBase}-${slugCounter}`
      } else {
        slugExists = false
      }
    }

    const options = {
      form: {
        fields: [
          { label: 'Name', type: 'text', required: true },
          { label: 'Email', type: 'email', required: true },
          { label: 'Message', type: 'textarea', required: true },
        ],
        to: user?.email,
        // subject: 'Contact Form Submission',
      },
    } as PageContactOptions

    page = await createPage({
      siteId,
      type: tables.PageType.CONTACT,
      title: 'Contact Form',
      slug,
      options,
    } as InsertPage)
  }

  return page
})
