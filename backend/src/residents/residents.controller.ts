import { Body, Controller, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { ResidentsService } from './residents.service'
import { CreateResidentDto } from './dto/create-resident.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { Roles } from '../common/guards/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'

@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Query('q') q?: string, @Query('building') building?: string, @Query('apartment') apartment?: string) {
    return this.residentsService.findAll(q, building, apartment)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff', 'admin')
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'photos', maxCount: 10 },
  ]))
  create(
    @Body() dto: CreateResidentDto,
    @UploadedFiles() files: { avatar?: Express.Multer.File[]; photos?: Express.Multer.File[] },
  ) {
    const payload = { avatar: files.avatar?.[0], photos: files.photos }
    if (typeof dto.members === 'string') dto.members = JSON.parse(dto.members as unknown as string)
    return this.residentsService.create(dto, payload)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.residentsService.findOne(id)
  }
}
