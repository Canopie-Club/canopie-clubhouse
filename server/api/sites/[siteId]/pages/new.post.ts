import { PrismaClient } from '@canopie-club/prisma-client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const pageBody = await readBody(event)
    const sessionId = authHeader.split(' ')[1]
    const siteId = getRouterParam(event, 'siteId')

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

    if (!pageBody.title || !pageBody.path || !pageBody.content) {
        throw new Error('Missing required fields')
    }

    if (!siteId) {
        throw new Error('Site not found')
    }
    
    const page = await prisma.page.create({
        data: {
            siteId: siteId,
            title: pageBody.title,
            path: pageBody.path,
            content: pageBody.content,
        }
    })

    if (!page) {
        throw new Error('Page not created')
    }

    return page
})