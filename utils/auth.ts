export function headers(headers?: HeadersInit) {
    const sessionId = useSessionKey();
    return {
        headers: {
            ...headers,
            Authorization: `Bearer ${sessionId.value}`
        } as HeadersInit
    }
}