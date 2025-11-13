import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { Severity } from '../../common/enums'

export class CreateComplaintDto {
  @IsString() title: string
  @IsString() description: string
  @IsString() building: string
  @IsString() apartment: string
  @IsString() @IsEnum(['NOISE','MAINTENANCE','SECURITY','OTHER'] as any) type: any
  @IsOptional() @IsBoolean() isAnonymous?: boolean
  @IsOptional() @IsString() contactName?: string
  @IsOptional() @IsString() contactPhone?: string
  @IsOptional() @IsEmail() contactEmail?: string
  @IsOptional() @IsString() severity?: Severity
}

