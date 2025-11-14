import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as swaggerUi from 'swagger-ui-express'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { join } from 'path'
import { initDb } from './db/mysql'

async function bootstrap() {
  // Init DB (ensure tables) before booting the app
  await initDb()

  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // Try both paths to support running from repo root or /app inside container
  const openapiCandidates = [
    join(process.cwd(), 'openapi.yaml'),
    join(process.cwd(), 'backend', 'openapi.yaml'),
  ]
  const openapiPath = openapiCandidates.find((p) => fs.existsSync(p))
  if (openapiPath) {
    const doc = yaml.load(fs.readFileSync(openapiPath, 'utf8'))
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc))
  }

  app.enableCors()
  await app.listen(process.env.PORT || 3000)
}

bootstrap()
