import { defineEventHandler, createError, readBody } from 'h3'
import { userSite } from '#common/server/utils/db.session'
import { upsertSubscriber } from '#common/server/utils/db.subscriber'
import { upsertSubscription } from '#common/server/utils/db.subscription'
import { SubscriptionMethod } from '#common/server/database/enums'
import type { InsertSubscriber, InsertSubscription } from '#common/server/types/db'

export default defineEventHandler(async event => {
  // TODO: THIS IS A TEMPORARY ENDPOINT TO IMPORT SUBSCRIBERS ONE BY ONE
  // IN THE FUTURE THIS SHOULD BE IMPLEMENTED WITH A STREAMING API

  const sessionId = getSessionId(event)
  const siteId = event.context.params?.siteId

  const { subscriber: newSubscriber } = await readBody<{ subscriber: InsertSubscriber }>(event)

  if (!siteId) {
    throw createError({ statusCode: 400, message: 'Site ID is required' })
  }

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 401, message: 'Site not found' })
  }

  const subscriber = await upsertSubscriber(newSubscriber)

  const siteSubscription = await upsertSubscription({
    subscriberId: subscriber.id,
    siteId: site.id,
    subscriptionMethod: SubscriptionMethod.IMPORT,
    unsubscribedAt: null,
  } as InsertSubscription)

  return {
    success: true,
    subscriber,
    siteSubscription,
  }
})
