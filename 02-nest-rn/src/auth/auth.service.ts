import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UsersService } from '@/modules/users/users.service'
import { comparePasswordHelper } from '@/helpers/util'
import { JwtService } from '@nestjs/jwt'
import { CreateAuthDto, VerifyAuthDto } from '@/auth/dto/create-auth.dto'
import { Verify } from 'crypto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(username)
    if (!user) return null
    const isValidPassword = await comparePasswordHelper(password, user.password)
    if (!isValidPassword) return null

    return user
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id }
    return {
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
      },
      access_token: this.jwtService.sign(payload),
    }
  }
  async register(registerDto: CreateAuthDto) {
    return await this.usersService.handleRegister(registerDto)
  }
  async verify(verifyDto: VerifyAuthDto) {
    return await this.usersService.handleActive(verifyDto)

  }
}
