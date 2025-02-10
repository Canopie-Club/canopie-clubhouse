import { v4 as uuidv4 } from 'uuid'
// TODO: Look at other crypto libraries
import bcrypt from 'bcryptjs'
import { tables, useDrizzle, eq } from '#common/server/utils/drizzle'
import type { SiteExtraType, SiteSummary } from '#common/server/types/db'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async event => {
  const { name, email, password } = await readBody(event)
  
  const [existingUser] = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .limit(1)

  if (existingUser)
    return {
      success: false,
      message: 'User already exists',
      user: null,
      session: null,
      sites: [],
    }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await createUser({name, email, password: hashedPassword, role: 'MEMBER', terms_date: new Date()})

  try {
    // await sendEmail(
    //   email,
    // 'Welcome to the team!',
    //   'You have been added to the team',
    // )
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Failed to send email',
      user,
      session: null,
      sites: [],
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
    sites: [] as SiteSummary[],
  }
})
