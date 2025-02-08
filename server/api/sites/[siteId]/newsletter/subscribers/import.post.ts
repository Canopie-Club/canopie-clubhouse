import { defineEventHandler, createError, readFormData } from 'h3'
import { userSite } from '#common/server/utils/db.session'
import { upsertSubscriber } from '#common/server/utils/db.subscriber'
import { upsertSubscription } from '#common/server/utils/db.subscription'
import { SubscriptionMethod } from '#common/server/database/enums'
import { parse } from 'csv-parse/sync'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const siteId = event.context.params?.siteId
  const form = await readFormData(event)

  const file = form.get('file') as File
  const mapping: Record<string, string[]> = JSON.parse(form.get('mapping') as string)

  if (!siteId) {
    throw createError({ statusCode: 400, message: 'Site ID is required' })
  }

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 401, message: 'Site not found' })
  }

  const fileContent = Buffer.from(await file.arrayBuffer())
  const results: { success: boolean; email: string; error?: string }[] = []

  try {
    const records = parse(fileContent, {
      columns: true,
      delimiter: ',',
      skip_empty_lines: true,
    })

    console.log('records', records.length)

    for (const record of records) {
      console.log('record', record)
      // try {
      //   const subscriber = await upsertSubscriber(site.id, {
      //     email: record[mapping.email[0]],
      //     firstName: record[mapping.firstName?.[0]],
      //     lastName: record[mapping.lastName?.[0]],
      //   })

      //   await upsertSubscription(site.id, subscriber.id, {
      //     method: SubscriptionMethod.IMPORT,
      //   })

      //   results.push({ success: true, email: subscriber.email })
      // } catch (error) {
      //   results.push({ success: false, email: record[mapping.email[0]], error: error.message })
      // }
    }
  } catch (error) {
    console.error('Error processing file:', error)
    throw createError({ statusCode: 500, message: 'Error processing file' })
  }

  return {
    success: true,
    message: `Imported ${results.filter(r => r.success).length} subscribers`,
    results,
  }
})
