import { tables, useDrizzle, eq } from '#common/server/utils/drizzle'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async event => {
  const { sessionKey } = getQuery(event)

  console.log(sessionKey)

  if (!sessionKey || typeof sessionKey !== 'string')
    return {
      success: false,
      message: 'Session key is required',
    }

  const [session] = await useDrizzle()
    .select()
    .from(tables.userSessions)
    .where(eq(tables.userSessions.id, sessionKey))
    .limit(1)

  if (!session) {
    return {
      success: false,
      message: 'Session key is invalid',
    }
  }

  await useDrizzle().delete(tables.userSessions).where(eq(tables.userSessions.id, sessionKey))

  return {
    success: true,
  }
})
