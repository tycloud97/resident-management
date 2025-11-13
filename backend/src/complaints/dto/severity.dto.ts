import { IsEnum } from 'class-validator'
import { Severity } from '../../common/enums'

export class UpdateSeverityDto { @IsEnum(['LOW','MEDIUM','HIGH','CRITICAL'] as any) severity: Severity }

