import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthService {
  login(email: string, password: string) {
    const users = [
      { id: '1', email: 'admin@example.com', name: 'Alice Admin', role: 'admin' },
      { id: '2', email: 'staff@example.com', name: 'Sam Staff', role: 'staff' },
      { id: '3', email: 'res@example.com', name: 'Rita Resident', role: 'resident' },
    ]
    const user = users.find((u) => u.email === email)
    if (!user || password !== 'password') throw new UnauthorizedException()
    const accessToken = `dev-${user.role}-token`
    return { user, accessToken }
  }
}

