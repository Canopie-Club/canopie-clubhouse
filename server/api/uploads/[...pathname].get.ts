export default eventHandler(async (event) => {
    const pathname = event.context.params?.pathname
    if (!pathname) {
        throw createError({ statusCode: 400, message: 'No pathname provided' })
    }

    console.log(pathname)

    return hubBlob().serve(event, pathname)
})