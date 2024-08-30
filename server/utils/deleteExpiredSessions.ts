export const deleteExpiredSessions = async () => {
    const result = await useDrizzle()
    .delete(tables.userSessions)
    .where(and(
        eq(tables.userSessions.expiresAt, new Date())
    ))
    .returning()

    return true;
}