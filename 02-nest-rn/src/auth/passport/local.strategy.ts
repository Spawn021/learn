import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password)
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid credentials',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    if (user.isActive === false) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Account is not activated',
        },
        HttpStatus.UNAUTHORIZED,
      )
    }
    return user
  }
}
