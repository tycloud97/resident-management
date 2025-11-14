import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { ComplaintsService } from './complaints.service'
import { CreateComplaintDto } from './dto/create-complaint.dto'
import { UpdateStatusDto } from './dto/update-status.dto'
import { AssignDto, AssignStageDto } from './dto/assign.dto'
import { UpdateSeverityDto } from './dto/severity.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { Roles } from '../common/guards/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Get()
  list(@Query() query: any) {
    return this.complaintsService.list(query)
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(@Body() dto: CreateComplaintDto, @UploadedFiles() files: any[]) {
    return this.complaintsService.create(dto, files)
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.complaintsService.detail(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff', 'admin')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.complaintsService.updateStatus(id, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff', 'admin')
  @Patch(':id/assign')
  assign(@Param('id') id: string, @Body() dto: AssignDto) {
    return this.complaintsService.assign(id, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff', 'admin')
  @Patch(':id/assign-stage')
  assignStage(@Param('id') id: string, @Body() dto: AssignStageDto) {
    return this.complaintsService.assignStage(id, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff', 'admin')
  @Patch(':id/severity')
  updateSeverity(@Param('id') id: string, @Body() dto: UpdateSeverityDto) {
    return this.complaintsService.updateSeverity(id, dto)
  }

  @Post(':id/comments')
  @UseInterceptors(FilesInterceptor('files'))
  comment(@Param('id') id: string, @Body() body: any, @UploadedFiles() files: Express.Multer.File[]) {
    return this.complaintsService.addComment(id, body, files)
  }
}
