import { tables, useDrizzle, eq } from '#common/server/utils/drizzle'
import type { SiteExtraType, SiteSummary, User } from '#common/server/types/db'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async event => {
  const { sessionId } = await readBody(event)

  console.time('verify-session')

  try {
    const [result] = await useDrizzle()
      .select({
        session: { id: tables.userSessions.id, expiresAt: tables.userSessions.expiresAt },
        user: tables.users,
      })
      .from(tables.userSessions)
      .where(eq(tables.userSessions.id, sessionId))
      .innerJoin(tables.users, eq(tables.userSessions.userId, tables.users.id))

    if (!result) {
      return {
        success: false,
        message: 'Session expired or not found',
        user: null,
        sites: null,
      }
    }

    const sites = await useDrizzle()
      .select({
        id: tables.sites.id,
        name: tables.sites.name,
        type: tables.sites.type,
      })
      .from(tables.sites)
      .innerJoin(tables.siteUsers, eq(tables.sites.id, tables.siteUsers.siteId))
      .where(eq(tables.siteUsers.userId, result.user.id))

    interface Session {
      id: string
      expiresAt: Date
      user: User
      sites: SiteSummary[]
    }

    const siteSummaries: SiteSummary[] = []

    await Promise.all(
      sites.map(async site => {
        const extras: SiteExtraType[] = (
          await useDrizzle()
            .select({
              extra: tables.siteExtras.extra,
            })
            .from(tables.siteExtras)
            .where(eq(tables.siteExtras.siteId, site.id))
        ).map(({ extra }) => extra as SiteExtraType)

        siteSummaries.push({
          id: site.id,
          name: site.name,
          type: site.type,
          extras,
        })
      }),
    )

    const session: Session = {
      id: result.session.id,
      expiresAt: result.session.expiresAt,
      user: result.user,
      sites: siteSummaries,
    }

    if (!session.id || session.expiresAt < new Date()) {
      await useDrizzle().delete(tables.userSessions).where(eq(tables.userSessions.id, sessionId))

      return {
        success: false,
        message: 'Session expired',
        user: null,
        sites: null,
      }
    }

    return {
      success: true,
      message: 'Got user',
      user: session.user,
      sites: session.sites,
    }
  } finally {
    console.timeEnd('verify-session')
  }
})
