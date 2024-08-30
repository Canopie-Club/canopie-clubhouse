import { v4 as uuidv4 } from 'uuid'
// TODO: Look at other crypto libraries
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    const {email, password} = await readBody(event)

    // const users = await useDrizzle().select().from(tables.users).where(eq(tables.users.email, email)).limit(1)
    const [user] = await useDrizzle().select().from(tables.users).where(eq(tables.users.email, email)).limit(1)

    if (!user) return {
        success: false,
        message: 'Username not found',
        user: null,
        session: null
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const passwordCorrect = await bcrypt.compare(password, user.password);
    console.log(hashedPassword, password, passwordCorrect)

    if (!passwordCorrect) return {
        success: false,
        message: 'Password incorrect',
        user: null,
        session: null
    }

    // Expires in 1 hour
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000)

    const [session] = await useDrizzle().insert(tables.userSessions).values({
        id: uuidv4(),
        userId: user.id,
        expiresAt
    }).returning()

    return {
        success: true,
        message: 'Got user',
        session,
        user
    };
})