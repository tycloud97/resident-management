import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { join } from 'path'
import { ComplaintsController } from './complaints.controller'
import { ComplaintsService } from './complaints.service'

@Module({
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule {}
