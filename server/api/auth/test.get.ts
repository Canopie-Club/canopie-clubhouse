import { v4 as uuidv4 } from 'uuid'
import { tables, useDrizzle, eq } from '#common/server/utils/drizzle'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const userId = '250fd11a-e7f6-4a21-9373-e97e7a4e883c'

  const [user] = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, userId))
    .limit(1)

  if (!user) {
    return {
      success: false,
      message: 'User not found',
    }
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
  }
})
