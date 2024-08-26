import { Page, PrismaClient } from '@canopie-club/prisma-client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const sessionId = authHeader.split(' ')[1]
    const siteId = getRouterParam(event, 'siteId')
    const pageId = getRouterParam(event, 'pageId')

    const page = await prisma.page.findUnique({
        where: {
            id: pageId,
        },
        include: {
            site: {
                include: {
                    users: {
                        include: {
                            user: {
                                include: {
                                    UserSession: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if (!page) {
        throw new Error('Page not found')
    }

    // Check if the user is in the site
    const found = page?.site.users.some(user => user.user.UserSession.some(session => session.id === sessionId))

    if (!found) {
        throw new Error('User not found in site')
    }

    delete (page as any).site

    return page as Page
})