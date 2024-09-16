import { Site, SiteExtraType, SiteSummary, User } from '~/assets/types/db';

export default defineEventHandler(async (event) => {
  const { sessionId } = await readBody(event);

  console.time("verify-session");

  const results = await useDrizzle()
    .select({
      session: { id: tables.userSessions.id, expiresAt: tables.userSessions.expiresAt },
      user: tables.users,
      site: {
        id: tables.sites.id,
        name: tables.sites.name,
        type: tables.sites.type,
      },
    })
    .from(tables.userSessions)
    .where(eq(tables.userSessions.id, sessionId))
    .innerJoin(tables.users, eq(tables.userSessions.userId, tables.users.id))
    .innerJoin(tables.siteUsers, eq(tables.users.id, tables.siteUsers.userId))
    .innerJoin(tables.sites, eq(tables.siteUsers.siteId, tables.sites.id))

  console.timeEnd("verify-session");
  if (!results.length) {
    return {
      success: false,
      message: "Session expired or not found",
      user: null,
      sites: null,
    };
  }

  interface Session {
    id: string;
    expiresAt: Date;
    user: User,
    sites: SiteSummary[]
  }

  const sessions: Session[] = [];

  await Promise.all(results.map(async(session) => {
    const site = session.site
    const extras: SiteExtraType[] = (await useDrizzle().select({
      extra: tables.siteExtras.extra,
    }).from(tables.siteExtras).where(eq(tables.siteExtras.siteId, session.site.id))).map(({extra}) => extra as SiteExtraType)

    if (!sessions.find((s) => s.id === session.session.id)) {
      sessions.push({
        id: session.session.id,
        expiresAt: session.session.expiresAt,
        user: session.user,
        sites: [{
          ...site,
          extras,
        }],
      });
      return;
    }
    sessions.find((s) => s.id === session.session.id)?.sites.push({
      ...site,
      extras,
    });
  }));

  const [session] = sessions;

  if (!session.id || session.expiresAt < new Date()) {
    await useDrizzle()
      .delete(tables.userSessions)
      .where(eq(tables.userSessions.id, sessionId));

    return {
      success: false,
      message: "Session expired",
      user: null,
      sites: null,
    };
  }

  return {
    success: true,
    message: "Got user",
    user: session.user,
    sites: session.sites,
  };
});
