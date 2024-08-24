import { PrismaClient } from '@canopie-club/prisma-client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const {sessionKey} = getQuery(event);

    console.log(sessionKey);

    if (!sessionKey || typeof sessionKey !== 'string') return {
        success: false,
        message: 'Session key is required'
    }

    await prisma.userSession.delete({
        where: {
            id: sessionKey
        }
    }).catch((e) => {
        return {
            success: false,
            message: 'Session key is invalid'
        }
    })

    return {
        success: true
    }
})