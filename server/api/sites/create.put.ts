import { successCatcher } from '#common/server/utils/general'
import { getUserFromSession } from '#common/server/utils/db.session'
import { defineEventHandler, createError } from 'h3'
import type { SiteExtraType } from '#common/server/types/db'

export default defineEventHandler(async event => {
    const sessionId = getSessionId(event)
    const {
        success,
        message,
        data: user,
    } = await successCatcher(async () => await getUserFromSession(sessionId))

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const { name, siteId, siteType, description, extras } = await readBody(event)

    const preExistingSite = await getSite(siteId, false)

    if (preExistingSite) {
        throw createError({ statusCode: 401, statusMessage: 'Site already exists' })
    }

    console.log({ name, siteId, siteType, description, extras })

    const site = await createSite({
        id: siteId,
        name,
        type: siteType,
    })

    if (!site) {
        throw createError({ statusCode: 401, statusMessage: 'Site could not be created' })
    }

    const siteExtras = []
    
    for (const extra of extras as SiteExtraType[]) {
        const siteExtra = await createSiteExtra({
            siteId,
            extra,
        })

        if (!siteExtra) {
            throw createError({ statusCode: 401, statusMessage: `Site extra could not be created: ${extra}` })
        }

        siteExtras.push(siteExtra)
    }

    const siteUser = await createSiteUser({
        siteId,
        userId: user.id,
        role: 'ADMIN',
    })

    if (!siteUser) {
        throw createError({ statusCode: 401, statusMessage: 'Site user could not be created' })
    }

    if (!success) {
        throw createError({ statusCode: 401, statusMessage: message })
    }

    return {
        success: true,
        message: 'Site created',
        data: {
            site,
            siteExtras,
            siteUser,
        },
    }
})
