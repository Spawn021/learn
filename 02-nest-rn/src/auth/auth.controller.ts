import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'

import { LocalAuthGuard } from '@/auth/passport/local-auth.guard'

import { Public } from '@/decorator/customize'
import { CreateAuthDto } from '@/auth/dto/create-auth.dto'
import { MailerService } from '@nestjs-modules/mailer'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req: any) {
    return this.authService.login(req.user)
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto)
  }

  @Get('mail')
  @Public()
  testMail() {
    this.mailerService.sendMail({
      to: 'tranquangnam27012002@gmail.com',
      subject: 'Testing Nest MailerModule ✔',
      text: 'welcome',
      template: 'register.hbs',
      context: {
        name: 'Nam',
        activationCode: '123456',
      },
    })
    return 'ok'
  }
}
