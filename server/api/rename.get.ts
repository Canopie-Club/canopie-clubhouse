import { defineEventHandler } from 'h3'
import { renameBlobs } from '#common/server/utils/r1.blob'

export default defineEventHandler(async event => {
  console.log('Renaming route')
  const oldPath = '/thedukeofnorfolk/Art/Wow2'
  const newPath = '/thedukeofnorfolk/Art/Wowza'
  console.log('Renaming', oldPath, newPath)
  return await renameBlobs(oldPath, newPath)
})
