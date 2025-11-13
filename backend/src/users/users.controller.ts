import { Controller, Get, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { Role } from '../common/enums'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('role') role?: Role) {
    return this.usersService.findAll(role)
  }
}

