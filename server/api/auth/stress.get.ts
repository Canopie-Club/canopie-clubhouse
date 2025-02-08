import { tables, useDrizzle, eq } from '#common/server/utils/drizzle'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const now = new Date()

  const sessionIds = [
    // '146a3c14-6978-49ac-a8f2-931fe8176a61',
    // 'ec1c3c7e-5954-492f-b73d-7912694ae022',
    // 'b14f1fd5-f780-4497-af73-ba066309c13f',
    // '2862e623-6cde-4617-9758-c85696cc702c',
    // '09cfc28e-60b3-4fb7-884e-95d07a17970b',
    // 'd62fcd60-eaf1-4c63-a95c-dbe2f4f14a33',
    '2de8984c-77df-4f3b-b6f3-bb6d1a2957de',
    '49d1323e-6825-4aed-99c8-88e3181556af',
    '8773bd7a-a19e-4258-9489-22345bdc026e',
    '78884e0f-3f53-4f86-862d-d403aff446b3',
    'c7ab3571-c1aa-47b9-99f2-968d1159e21c',
    '75c82b25-fee1-49d6-98f0-13d93a64e1ae',
    '09f4a90d-a8e1-4491-a90e-499e2a9ce8c0',
    '11450e1c-8c48-48c6-a554-0a3852af540c',
    '4f5cf555-31af-4835-9798-6ff056c7a963',
  ]

  const sessionId = sessionIds[Math.floor(Math.random() * sessionIds.length)]

  const [session] = await useDrizzle()
    .select()
    .from(tables.userSessions)
    .where(eq(tables.userSessions.id, sessionId))
    .limit(1)
    .innerJoin(tables.users, eq(tables.userSessions.userId, tables.users.id))

  const responseTime = `${new Date().getTime() - now.getTime()}ms`

  if (!session) {
    return {
      sessionId,
      success: false,
      message: 'Session expired or not found',
      user: null,
      responseTime,
    }
  }

  return {
    sessionId,
    success: true,
    message: 'Got user',
    user: session.users,
    responseTime,
  }
})
