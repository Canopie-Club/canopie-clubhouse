import { getUserFromSession } from '#common/server/utils/db.session'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async event => {
  const sessionId = '09211dfd-9cbb-4c3f-8ed5-f24a2fbe4d82'
  const user = await getUserFromSession(sessionId)
  return user
})
