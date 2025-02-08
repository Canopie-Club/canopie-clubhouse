import { defineEventHandler, createError, getQuery } from 'h3'
import { getSiteLetters } from '#common/server/utils/db.session/newsletter'
import { userSite } from '#common/server/utils/db.session'
import { InsertEmailCampaign } from '@canopie-club/toolbox/dist/runtime/common/server/types/db.js'

export default defineEventHandler(async event => {
    const sessionId = getSessionId(event)
    const siteId = event.context.params?.siteId
    const { content, subject } = (await readBody(event)) as Partial<InsertEmailCampaign>

    if (!siteId) {
        throw createError({ statusCode: 400, message: 'Site ID is required' })
    }

    const [site] = await userSite(sessionId, siteId)

    if (!site) {
        throw createError({ statusCode: 401, message: 'Site not found' })
    }

    const result = await createEmailCampaign({
        siteId: site.id,
        content: content || '',
        subject: subject || '',
    })


    return result
})
