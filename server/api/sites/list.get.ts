import { getSessionId } from '../utils/session'

export default defineEventHandler(async (event) => {
    const sessionId = getSessionId(event)
    const {success, message, data: sites} = await successCatcher(async () => await userSite(sessionId))

    if (!success) {
        throw createError({statusCode: 401, statusMessage: message})
    }

    return sites
})