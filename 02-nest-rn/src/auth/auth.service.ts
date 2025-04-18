import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UsersService } from '@/modules/users/users.service'
import { comparePasswordHelper } from '@/helpers/util'
import { JwtService } from '@nestjs/jwt'
import { CreateAuthDto } from '@/auth/dto/create-auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(username)
    const isValidPassword = await comparePasswordHelper(password, user.password)
    if (!user || !isValidPassword) return null

    return user
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
  async register(registerDto: CreateAuthDto) {
    return await this.usersService.handleRegister(registerDto)
  }
}
