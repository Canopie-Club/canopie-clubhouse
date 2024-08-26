import { PrismaClient } from '@canopie-club/prisma-client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const sessionId = authHeader.split(' ')[1]
    const siteId = getRouterParam(event, 'siteId')

    const site = await prisma.site.findUnique({
        where: {
            id: siteId,
        },
        include: {
            users: {
                include: {
                    user: {
                        include: {
                            UserSession: true
                        }
                    },
                }
            },
            pages: true
        }
    })

    if (!site) {
        throw new Error('Site not found')
    }

    // Check if the user is in the site
    const found = site?.users.some(user => user.user.UserSession.some(session => session.id === sessionId))

    if (!found) {
        throw new Error('User not found in site')
    }

    return site
})