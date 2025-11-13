import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as express from 'express'
import * as swaggerUi from 'swagger-ui-express'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  const openapiPath = join(process.cwd(), 'backend', 'openapi.yaml')
  if (fs.existsSync(openapiPath)) {
    const doc = yaml.load(fs.readFileSync(openapiPath, 'utf8'))
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc))
  }

  app.enableCors()
  await app.listen(process.env.PORT || 3000)
}

bootstrap()

