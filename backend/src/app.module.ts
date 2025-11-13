import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ResidentsModule } from './residents/residents.module'
import { ComplaintsModule } from './complaints/complaints.module'
import { DashboardModule } from './dashboard/dashboard.module'

@Module({
  imports: [
    MulterModule.register({ dest: join(process.cwd(), 'uploads') }),
    ServeStaticModule.forRoot({ rootPath: join(process.cwd(), 'uploads'), serveRoot: '/uploads' }),
    AuthModule,
    UsersModule,
    ResidentsModule,
    ComplaintsModule,
    DashboardModule,
  ],
})
export class AppModule {}
