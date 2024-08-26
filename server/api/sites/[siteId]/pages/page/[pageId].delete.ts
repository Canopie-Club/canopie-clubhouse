import { PrismaClient } from '@canopie-club/prisma-client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const sessionId = authHeader.split(' ')[1]
    const siteId = getRouterParam(event, 'siteId')
    const pageId = getRouterParam(event, 'pageId')

    console.log(sessionId)

    const sites = await prisma.userSession.findUnique({
        where: {
            id: sessionId
        },
        include: {
            user: {
                include: {
                    sites: {
                        include: {
                            site: true
                        }
                    }
                }
            }
        }
    })

    if (!sites) {
        throw new Error('User not found')
    }

    if (!sites.user.sites.some(site => site.siteId === siteId)) {
        throw new Error('User not in site')
    }

    const page = await prisma.page.delete({
        where: {
            id: pageId,
        },
    })

    if (!page) {
        throw new Error('Site not found')
    }

    return page
})