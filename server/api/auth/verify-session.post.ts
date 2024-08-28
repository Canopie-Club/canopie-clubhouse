export default defineEventHandler(async (event) => {
  const { sessionId } = await readBody(event);

  console.time("verify-session");

  const [session] = await useDrizzle()
    .select()
    .from(tables.userSessions)
    .where(eq(tables.userSessions.id, sessionId))
    .limit(1)
    .innerJoin(tables.users, eq(tables.userSessions.userId, tables.users.id));

  if (!session) {
    console.timeEnd("verify-session");
    return {
      success: false,
      message: "Session expired or not found",
      user: null,
    };
  }

  if (!session.user_sessions || session.user_sessions.expiresAt < new Date()) {
    await useDrizzle()
      .delete(tables.userSessions)
      .where(eq(tables.userSessions.id, sessionId));
    return {
      success: false,
      message: "Session expired",
      user: null,
    };
  }

  console.timeEnd("verify-session");
  return {
    success: true,
    message: "Got user",
    user: session.users,
  };
});
