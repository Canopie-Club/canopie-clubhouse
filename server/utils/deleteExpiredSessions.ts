import { PrismaClient } from "@canopie-club/prisma-client";

const prisma = new PrismaClient();

export const deleteExpiredSessions = async () => {
    await prisma.userSession.deleteMany({
        where: {
            expiresAt: {
                lt: new Date()
            }
        }
    }).catch((error: any) => {
        console.error(error);
        return false;
    });

    return true;
}