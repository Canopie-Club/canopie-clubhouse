import { defineEventHandler, createError, getRequestWebStream } from 'h3'
import { userSite } from '#common/server/utils/db.session'
import { upsertSubscriber } from '#common/server/utils/db.subscriber'
import { upsertSubscription } from '#common/server/utils/db.subscription'
import { SubscriptionMethod } from '#common/server/database/enums'
import { parse } from 'csv-parse'
import * as stream from 'node:stream'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const siteId = event.context.params?.siteId

  throw createError({ statusCode: 500, message: 'Not implemented' })

  //   if (!siteId) {
  //     throw createError({ statusCode: 400, message: 'Site ID is required' })
  //   }

  //   const [site] = await userSite(sessionId, siteId)

  //   if (!site) {
  //     throw createError({ statusCode: 401, message: 'Site not found' })
  //   }

  //   const body = await readMultipartFormData(event)
  //   const file = body.find(part => part.name === 'file')
  //   const mapping = JSON.parse(body.find(part => part.name === 'mapping')?.data.toString() || '{}')

  //   if (!file || !mapping) {
  //     throw createError({ statusCode: 400, message: 'File and mapping are required' })
  //   }

  //   console.log('mapping', mapping)

  //   const results: { success: boolean; email: string; error?: string }[] = []

  //   try {
  //     await new Promise((resolve, reject) => {
  //       const parser = parse({
  //         columns: true,
  //         delimiter: ',',
  //         skip_empty_lines: true,
  //       })

  //       parser.on('readable', async function () {
  //         let record
  //         while ((record = parser.read()) !== null) {
  //           console.log('record', record)
  //           // try {
  //           //   const subscriber = await upsertSubscriber(site.id, {
  //           //     email: record[mapping.email[0]],
  //           //     firstName: record[mapping.firstName?.[0]],
  //           //     lastName: record[mapping.lastName?.[0]],
  //           //   })

  //           //   await upsertSubscription(site.id, subscriber.id, {
  //           //     method: SubscriptionMethod.IMPORT,
  //           //   })

  //           //   results.push({ success: true, email: subscriber.email })
  //           // } catch (error) {
  //           //   results.push({ success: false, email: record[mapping.email[0]], error: error.message })
  //           // }
  //         }
  //       })

  //       parser.on('error', error => {
  //         console.error('error', error)
  //         reject(error)
  //       })

  //       parser.on('end', () => {
  //         console.log('end')
  //         resolve(null)
  //       })

  //       // Create a readable stream from the file content
  //       const fileStream = stream.Readable.from(file.data)
  //       fileStream.pipe(parser)
  //     })
  //   } catch (error) {
  //     console.error('error', error)
  //     throw createError({ statusCode: 500, message: 'Error processing file' })
  //   }

  //   console.log('results', results)

  //   return {
  //     success: true,
  //     message: `Imported ${results.filter(r => r.success).length} subscribers`,
  //     results,
  //   }
})

// // Helper function to read multipart form data
// async function readMultipartFormData(event) {
//   const body = []
//   const webStream = await getRequestWebStream(event)
//   const reader = webStream.getReader()

//   while (true) {
//     const { done, value } = await reader.read()
//     if (done) break
//     body.push(value)
//   }

//   const buffer = Buffer.concat(body)
//   const boundary = event.req.headers['content-type'].split('boundary=')[1]
//   return parseMultipartFormData(buffer, boundary)
// }

// // Helper function to parse multipart form data
// function parseMultipartFormData(buffer, boundary) {
//   const parts = []
//   const boundaryBuffer = Buffer.from(`--${boundary}`)
//   let start = buffer.indexOf(boundaryBuffer)
//   let end = buffer.indexOf(boundaryBuffer, start + boundaryBuffer.length)

//   while (start !== -1 && end !== -1) {
//     const part = buffer.slice(start + boundaryBuffer.length, end)
//     const headers = {}
//     const headerEnd = part.indexOf('\r\n\r\n')
//     const headerLines = part.slice(0, headerEnd).toString().split('\r\n')

//     headerLines.forEach(line => {
//       const [key, value] = line.split(': ')
//       headers[key.toLowerCase()] = value
//     })

//     const contentDisposition = headers['content-disposition']
//     const name = contentDisposition.match(/name="([^"]+)"/)[1]
//     const filename = contentDisposition.match(/filename="([^"]+)"/)

//     parts.push({
//       name,
//       filename: filename ? filename[1] : undefined,
//       type: headers['content-type'],
//       data: part.slice(headerEnd + 4),
//     })

//     start = end
//     end = buffer.indexOf(boundaryBuffer, start + boundaryBuffer.length)
//   }

//   return parts
// }
