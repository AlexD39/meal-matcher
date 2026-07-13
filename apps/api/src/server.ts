import { buildApp } from './app.js'

const PORT = 3000
const HOST = '127.0.0.1'

async function startServer(): Promise<void> {
  const app = await buildApp()

  try {
    await app.listen({
      port: PORT,
      host: HOST,
    })

    console.log('')
    console.log(`Meal Matcher API: http://${HOST}:${PORT}`)
    console.log(`Estado de la API: http://${HOST}:${PORT}/api/v1/health`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

void startServer()