import { IsEnum, IsString } from 'class-validator'
import { ComplaintStatus } from '../../common/enums'

export class AssignDto { @IsString() assignedTo: string }
export class AssignStageDto { @IsEnum(['NEW','IN_PROGRESS','RESOLVED','REJECTED'] as any) stage: ComplaintStatus; @IsString() assignedTo: string }

