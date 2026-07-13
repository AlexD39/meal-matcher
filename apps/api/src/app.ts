import Fastify, { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  })

  await app.register(cors, {
    origin: 'http://localhost:5173',
  })

  app.get('/api/v1/health', async () => {
    return {
      success: true,
      status: 'ok',
      application: 'Meal Matcher API',
      databaseConnected: false,
      modelLoaded: false,
      timestamp: new Date().toISOString(),
    }
  })

  return app
}