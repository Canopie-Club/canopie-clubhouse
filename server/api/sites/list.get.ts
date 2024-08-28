export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization') || ''
    const sessionId = authHeader.split(' ')[1]
    const {success, message, sites} = await userSite(sessionId)

    if (!success) {
        throw createError({statusCode: 401, statusMessage: message})
    }

    return sites
})