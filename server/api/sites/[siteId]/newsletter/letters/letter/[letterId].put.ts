import { defineEventHandler, createError, getQuery } from 'h3'
import { updateEmailCampaign } from '#common/server/utils/db.emailCampaign'
import { userSite } from '#common/server/utils/db.session'
import { InsertEmailCampaign } from '@canopie-club/toolbox/dist/runtime/common/server/types/db.js'

export default defineEventHandler(async event => {
    const sessionId = getSessionId(event)
    const siteId = event.context.params?.siteId
    const letter = (await readBody(event)) as UpdateEmailCampaign

    if (!letter.id) {
        throw createError({ statusCode: 400, message: 'Letter ID is required' })
    }

    if (!siteId) {
        throw createError({ statusCode: 400, message: 'Site ID is required' })
    }

    const [site] = await userSite(sessionId, siteId)

    if (!site) {
        throw createError({ statusCode: 401, message: 'Site not found' })
    }

    const result = await updateEmailCampaign({
        ...letter,
        content: letter.content || '',
        subject: letter.subject || 'Untitled',
        createdAt: letter.createdAt ? new Date(letter.createdAt) : new Date(),
        updatedAt: new Date(),
        siteId: site.id
    })


    return result
})
