import { ensureBlob, hubBlob } from '@nuxthub/core/dist/runtime/blob/server/utils/blob'
import { userSite } from '#common/server/utils/db.session'
import { eventHandler, readFormData, createError } from 'h3'
import type { BlobObject } from '@nuxthub/core'

export default eventHandler<Promise<BlobObject[]>>(async event => {
  const form = await readFormData(event)
  let path = form.get('filepath') as string
  const fileKeys = [...form.keys()].filter(key => key.startsWith('files'))
  const files = fileKeys
    .map(key => form.get(key))
    .filter(file => file && (file as File).size) as File[]

  const sessionId = getSessionId(event)
  const siteId = event.context.params?.siteId

  const [site] = await userSite(sessionId, siteId)

  if (!site) {
    throw createError({ statusCode: 400, message: 'Site not found' })
  }

  if (files.length === 0) {
    console.log('no files')
    throw createError({ statusCode: 400, message: 'No file(s) provided' })
  }

  if (!path) {
    console.log('no path', path, form.keys())
    throw createError({ statusCode: 400, message: 'No path provided' })
  }

  path = path.replaceAll(new RegExp(`^${site.id}/|^${site.id}/?$`, 'g'), '')

  const results: BlobObject[] = []
  for (const file of files) {
    ensureBlob(file, {
      maxSize: '16MB',
      types: ['image'],
    })

    results.push(
      await hubBlob().put(file.name, file, {
        addRandomSuffix: false,
        prefix: `${site.id}/${path}`,
      }),
    )
  }

  return results
})
