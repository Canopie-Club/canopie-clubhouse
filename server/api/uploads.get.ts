export default eventHandler(async (event) => {
    return hubBlob().list({
      prefix: 'images'
    })
})