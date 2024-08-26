import { PrismaClient } from '@canopie-club/prisma-client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''

    const sessionId = authHeader.split(' ')[1]

    const session = await prisma.userSession.findUnique({
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

    console.log(session)



    // const siteUsers = await prisma.siteUser.findMany({
    //     where: {
    //         userId: session?.user.id
    //     }
    // })
    // const siteUsers = await prisma.siteUser.findMany()

    // console.log(siteUsers)

    // const newPassword = '8.M@gg1e.canopie'
    // const passwordHash = await bcrypt.hash(newPassword, 10)
    
    // await prisma.user.update({
    //     where: {
    //         id: userId
    //     },
    //     data: {
    //         password: passwordHash
    //     }
    // })

    // return user
    return session?.user.sites
})