import { Injectable } from '@nestjs/common'
import { Role } from '../common/enums'

@Injectable()
export class UsersService {
  private users = [
    { id: '1', email: 'admin@example.com', name: 'Alice Admin', role: 'admin' as Role },
    { id: '2', email: 'staff@example.com', name: 'Sam Staff', role: 'staff' as Role },
    { id: '3', email: 'res@example.com', name: 'Rita Resident', role: 'resident' as Role },
  ]

  findAll(role?: Role) {
    return role ? this.users.filter((u) => u.role === role) : this.users
  }
}

