import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ComplaintStatus } from '../../common/enums'

export class UpdateStatusDto {
  @IsEnum(['NEW','IN_PROGRESS','RESOLVED','REJECTED'] as any) status: ComplaintStatus
  @IsOptional() @IsString() message?: string
}

