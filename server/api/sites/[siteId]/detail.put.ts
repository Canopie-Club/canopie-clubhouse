import { PrismaClient } from '@canopie-club/prisma-client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const siteBody = await readBody(event)
    const sessionId = authHeader.split(' ')[1]

    console.log(siteBody, sessionId)

    const sites = await prisma.userSession.findUnique({
        where: {
            id: sessionId
        },
        include: {
            user: {
                include: {
                    sites: {
                        select: {
                            siteId: true
                        }
                    }
                }
            }
        }
    })

    if (!sites) {
        throw new Error('User not found')
    }

    if (!sites.user.sites.some(site => site.siteId === siteBody.id)) {
        throw new Error('User not in site')
    }

    delete siteBody.users;
    delete siteBody.pages;
    
    const site = await prisma.site.update({
        where: {
            id: siteBody.id,
        },
        data: siteBody
    })

    if (!site) {
        throw new Error('Site not found')
    }

    return site
})