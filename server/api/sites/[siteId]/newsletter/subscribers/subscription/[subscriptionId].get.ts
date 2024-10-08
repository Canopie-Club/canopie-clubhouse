import { defineEventHandler, createError, getQuery } from 'h3'
import { userSite } from '#common/server/utils/db.session'

export default defineEventHandler(async event => {
    const sessionId = getSessionId(event)
    const siteId = event.context.params?.siteId

    if (!siteId) {
        throw createError({ statusCode: 400, message: 'Site ID is required' })
    }

    const [site] = await userSite(sessionId, siteId)

    if (!site) {
        throw createError({ statusCode: 401, message: 'Site not found' })
    }

    const { page = 1, pageSize = 10 } = getQuery(event)

    const subscriptionId = event.context.params?.subscriptionId

    if (!subscriptionId) {
        throw createError({ statusCode: 400, message: 'Subscription ID is required' })
    }

    const [result] = await useDrizzle()
        .select({
            subscriber: tables.subscribers,
            subscription: tables.subscriptions,
        })
        .from(tables.subscriptions)
        .where(eq(tables.subscriptions.id, subscriptionId))
        .innerJoin(tables.subscribers, eq(tables.subscriptions.subscriberId, tables.subscribers.id))

    return result
})
