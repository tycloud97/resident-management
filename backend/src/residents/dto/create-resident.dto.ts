import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class MemberDto {
  @IsString() fullName: string
  @IsString() relation: string
  @IsOptional() @Type(() => Number) age?: number
  @IsOptional() @IsString() phone?: string
}

export class CreateResidentDto {
  @IsString() fullName: string
  @IsOptional() @IsEmail() email?: string
  @IsOptional() @IsString() phone?: string
  @IsString() building: string
  @IsString() apartment: string
  @IsOptional() @IsString() note?: string

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MemberDto)
  members?: MemberDto[]
}

