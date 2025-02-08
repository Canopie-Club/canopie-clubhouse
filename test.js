import { consola } from 'consola'
    
async function runScript() {
    const clearDB = await consola.prompt('Do you want to clear the database and retry migrations? (y/N)', {
        type: 'confirm',
    })
    console.log('clearDB:', clearDB)
}

runScript()


