import { getRequestHeader, type H3Event } from 'h3'

export const getSessionId = (event: H3Event) => {
  const authHeader = getRequestHeader(event, 'Authorization') || ''
  const sessionId = authHeader.split(' ')[1]
  if (!sessionId) {
    throw new Error('No session id found')
  }
  return sessionId
}
