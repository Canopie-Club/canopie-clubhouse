import { PrismaClient } from '@canopie-club/prisma-client'

const prisma = new PrismaClient({
    log: ['info'],
  })

export default defineEventHandler(async (event) => {
    const { sessionId } = await readBody(event)

    console.time('verify-session');

    const session = await prisma.userSession.findUnique({
        where: {
            id: sessionId,
            expiresAt: {
                gt: new Date()
            }
        },
        include: {
            user: true
        }
    })

    console.timeEnd('verify-session');

    if (!session) {
        return {
            success: false,
            message: 'Session expired or not found',
            user: null
        }
    }
    
    return {
        success: true,
        message: 'Got user',
        user: session.user
    };
})