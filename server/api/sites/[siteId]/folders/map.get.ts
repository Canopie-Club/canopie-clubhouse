import type { FolderMap, InsertFolder } from '#common/server/types/db'
import { userSite } from '#common/server/utils/db.session'
import { defineEventHandler, getRouterParam } from 'h3'
import { createFolder, getSiteFolders } from '#common/server/utils/db.folder'

export default defineEventHandler(async event => {
  const sessionId = getSessionId(event)
  const siteId = getRouterParam(event, 'siteId')

  const [site] = await userSite(sessionId, siteId)

  let folders = await getSiteFolders(site.id)

  if (!folders.length) {
    // Create root folder
    const rootFolder = await createFolder({
      siteId,
      name: 'Home',
      parentId: null,
    } as InsertFolder)

    folders = [rootFolder]
  }

  let folderMap: FolderMap | null = null

  const findChildren = (parentId: string, path: string): FolderMap[] => {
    const childrenMap: FolderMap[] = []
    const children = folders.filter(folder => folder.parentId === parentId)
    if (children.length) {
      childrenMap.push(
        ...children.map(folder => ({
          name: folder.name,
          id: folder.id,
          children: findChildren(folder.id, `${path}/${folder.name}`),
          path: `${path}/${folder.name}`,
        })),
      )
    }
    return childrenMap
  }

  // Build folder map starting with root folder
  const rootFolder = folders.find(folder => folder.parentId === null)
  if (rootFolder) {
    folderMap = {
      name: rootFolder.name,
      id: rootFolder.id,
      children: findChildren(rootFolder.id, site.id),
      path: site.id,
    }
  }

  return folderMap
})
