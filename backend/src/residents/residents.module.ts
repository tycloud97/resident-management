import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { join } from 'path'
import { ResidentsController } from './residents.controller'
import { ResidentsService } from './residents.service'

@Module({
  imports: [MulterModule.register({ dest: join(process.cwd(), 'uploads') })],
  controllers: [ResidentsController],
  providers: [ResidentsService],
})
export class ResidentsModule {}
