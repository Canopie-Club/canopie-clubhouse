import { v4 as uuidv4 } from 'uuid'
// TODO: Look at other crypto libraries
import bcrypt from 'bcryptjs'
import { tables, useDrizzle, eq } from '#common/server/utils/drizzle'
import type { SiteExtraType, SiteSummary } from '#common/server/types/db'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async event => {
  const { email, password } = await readBody(event)

  // const users = await useDrizzle().select().from(tables.users).where(eq(tables.users.email, email)).limit(1)
  const [user] = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .limit(1)

  if (!user)
    return {
      success: false,
      message: 'Username not found',
      user: null,
      session: null,
      sites: [],
    }

  const hashedPassword = await bcrypt.hash(password, 10)
  const passwordCorrect = await bcrypt.compare(password, user.password)
  console.log(hashedPassword, password, passwordCorrect)

  if (!passwordCorrect)
    return {
      success: false,
      message: 'Password incorrect',
      user: null,
      session: null,
      sites: [],
    }

  const sites = await useDrizzle()
    .select({ id: tables.sites.id, name: tables.sites.name, type: tables.sites.type })
    .from(tables.siteUsers)
    .where(eq(tables.siteUsers.userId, user.id))
    .innerJoin(tables.sites, eq(tables.sites.id, tables.siteUsers.siteId))

  for (const site of sites) {
    const extras: SiteExtraType[] = (
      await useDrizzle()
        .select({ extra: tables.siteExtras.extra })
        .from(tables.siteExtras)
        .where(eq(tables.siteExtras.siteId, site.id))
    ).map(({ extra }) => extra as SiteExtraType)

    ;(site as SiteSummary).extras = extras
  }

  // Expires in 1 hour
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000)

  const [session] = await useDrizzle()
    .insert(tables.userSessions)
    .values({
      id: uuidv4(),
      userId: user.id,
      expiresAt,
    })
    .returning()

  return {
    success: true,
    message: 'Got user',
    session,
    user,
    sites: sites as SiteSummary[],
  }
})
