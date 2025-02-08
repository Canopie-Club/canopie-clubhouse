import { successCatcher } from '#common/server/utils/general'
import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const {
    success,
    message,
    data: sites,
  } = await successCatcher(async () => await userSite(sessionId))

  if (!success) {
    throw createError({ statusCode: 401, statusMessage: message })
  }

  return sites
})
