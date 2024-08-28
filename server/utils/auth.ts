import { and, eq } from 'drizzle-orm';
import { InferSelectModel } from 'drizzle-orm';

export async function userFromSession(sessionId: string) {
  const [user] = await useDrizzle()
    .select()
    .from(tables.userSessions)
    .where(eq(tables.userSessions.id, sessionId))
    .leftJoin(tables.users, eq(tables.users.id, tables.userSessions.userId))

    return {session: user?.user_sessions, user: user?.users, expired: user?.user_sessions?.expiresAt < new Date()}
}

export async function userSites(sessionId: string) {
  if (!sessionId || typeof sessionId !== 'string') {
    return {success: false, message: 'Session Id Missing'}
  }

  const user = await userFromSession(sessionId)
  if (!user || !user.user) {
    return {success: false, message: 'User not found / Session expired'}
  }

  if (user.expired) {
    return {success: false, message: 'Session expired'}
  }

  const sites = await useDrizzle()
    .select()
    .from(tables.siteUsers)
    .where(eq(tables.siteUsers.userId, user.user.id))
    .leftJoin(tables.sites, eq(tables.sites.id, tables.siteUsers.siteId))

  return {success: true, message: 'Sites found', site: sites.map(site => site.sites)}
}

export async function userSite(sessionId: string, siteId?: string, pageId?: string) {
  if (!sessionId || typeof sessionId !== 'string') {
    return {success: false, message: 'Session Id Missing'}
  }

  const user = await userFromSession(sessionId)

  if (!user || !user.user) {
    return {success: false, message: 'User not found / Session expired'}
  }

  if (user.expired) {
    return {success: false, message: 'Session expired'}
  }

  let query = useDrizzle()
    .select()
    .from(tables.siteUsers)
    .where(
      and(
        eq(tables.siteUsers.userId, user.user.id),
        siteId ? eq(tables.siteUsers.siteId, siteId) : undefined,
        pageId ? eq(tables.pages.id, pageId) : undefined
      )
    )
    .leftJoin(tables.sites, eq(tables.sites.id, tables.siteUsers.siteId))

  if(siteId || pageId) {
    query = query.leftJoin(tables.pages, eq(tables.pages.siteId, tables.sites.id))
  }

  // Remove the separate pageId condition
  const request = await query

  interface SiteWithPages extends InferSelectModel<typeof tables.sites> {
    pages: InferSelectModel<typeof tables.pages>[]
  }

  interface SiteResult {
    sites: InferSelectModel<typeof tables.sites> | null;
    site_users: InferSelectModel<typeof tables.siteUsers>;
    pages?: InferSelectModel<typeof tables.pages> | null;
  }

  const sites: SiteWithPages[] = [];

  request.forEach((site: SiteResult) => {
    if (!sites.some(s => s.id === site.sites?.id)) {
      sites.push({...site.sites!, pages: site.pages ? [site.pages] : []})
    } else {
      const existingSite = sites.find(s => s.id === site.sites?.id)
      if (existingSite && site.pages) {
        existingSite.pages.push(site.pages)
      }
    }
  })

  if (sites.length === 0) {
    return {success: false, message: 'User does not have access to site'}
  }

  const pages = sites.flatMap(site => site.pages)

  if (pageId && pages.length === 0) {
    return {success: false, message: 'Page not found or user does not have access to the page'}
  }

  return {success: true, message: 'Site found', sites}
}