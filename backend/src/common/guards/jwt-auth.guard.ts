import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Role } from '../enums'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // TODO 2025.11.14: Temporary implementation for testing, will implement JWT authentication later.
    const req = context.switchToHttp().getRequest()
    const auth = req.headers['authorization'] as string | undefined
    if (!auth || !auth.startsWith('Bearer ')) throw new UnauthorizedException()
    const token = auth.slice(7)
    let role: Role = 'resident'
    if (token.includes('admin')) role = 'admin'
    else if (token.includes('staff')) role = 'staff'
    req.user = { id: 'u-'+role, email: role+'@example.com', name: role.toUpperCase(), role }
    return true
  }
}

