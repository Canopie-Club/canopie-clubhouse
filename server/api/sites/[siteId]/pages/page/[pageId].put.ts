import { PrismaClient } from '@canopie-club/prisma-client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const pageBody = await readBody(event)
    const sessionId = authHeader.split(' ')[1]
    const siteId = getRouterParam(event, 'siteId')
    const pageId = getRouterParam(event, 'pageId')

    console.log(pageBody, sessionId)

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

    delete pageBody.users;
    delete pageBody.pages;
    
    const site = await prisma.page.update({
        where: {
            id: pageId,
        },
        data: pageBody
    })

    if (!site) {
        throw new Error('Site not found')
    }

    return site
})