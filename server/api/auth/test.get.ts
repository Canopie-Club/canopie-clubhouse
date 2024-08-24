import { PrismaClient } from '@canopie-club/prisma-client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const userId = "250fd11a-e7f6-4a21-9373-e97e7a4e883c";

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    const newPassword = '8.M@gg1e.canopie'
    const passwordHash = await bcrypt.hash(newPassword, 10)
    
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: passwordHash
        }
    })

    return user
})