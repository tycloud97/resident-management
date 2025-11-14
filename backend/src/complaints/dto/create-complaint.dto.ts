import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { Severity } from '../../common/enums'

export class CreateComplaintDto {
  @IsString() title: string
  @IsString() description: string
  @IsString() building: string
  @IsOptional() @IsString() residentId?: string
  @IsString() apartment: string
  @IsString() @IsEnum(['NOISE','MAINTENANCE','SECURITY','OTHER'] as any) type: any
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (typeof value === 'string' ? value === 'true' : value))
  isAnonymous?: boolean
  @IsOptional() @IsString() contactName?: string
  @IsOptional() @IsString() contactPhone?: string
  @IsOptional() @IsEmail() contactEmail?: string
  @IsOptional() @IsString() severity?: Severity
  @IsOptional() @IsString() assignedTo?: string
}
