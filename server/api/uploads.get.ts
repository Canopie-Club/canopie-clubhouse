import { hubBlob } from '@nuxthub/core/dist/runtime/blob/server/utils/blob'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  return hubBlob().list()
})
