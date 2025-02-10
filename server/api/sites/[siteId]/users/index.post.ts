import type { SiteExtraType } from '#common/server/types/db'
import { useDrizzle, tables, eq } from '#common/server/utils/drizzle'
import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, createError, getRouterParam } from 'h3'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const siteId = getRouterParam(event, 'siteId')
  const body = await readBody(event)

  const email = body.email
  let role = body.role

  role = role || "MEMBER";

  if (!["MEMBER", "ADMIN", "SUPER_ADMIN"].includes(role)) {
    return {
      success: false,
      message: "Invalid role",
      data: null,
    };
  }

  if (!siteId) {
    throw createError({ statusCode: 400, statusMessage: 'Site ID is required' })
  }

  if (!email) {
    return {
      success: false,
      message: 'Email is required',
      data: null,
    }
  }

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 401, statusMessage: 'Site not found' })
  }

  const [newUser] = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .limit(1)

  console.log(newUser)

  if (!newUser)
    return {
      success: false,
      message: 'User not found',
      data: null,
    }

  const [existingRecord] = await useDrizzle()
    .select()
    .from(tables.siteUsers)
    .where(and(eq(tables.siteUsers.siteId, siteId), eq(tables.siteUsers.userId, newUser.id)))
    .limit(1);

  if (existingRecord)
    return {
      success: false,
      message: "User already on site",
      data: null,
    };
    


  const result = await createSiteUser({
    siteId,
    userId: newUser.id,
    role,
  });

  return {
    success: true,
    message: 'User added',
    data: result,
  }
})
