import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from '@/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  ) // Validate incoming requests and strip out any properties that are not defined in the DTOs
  const configService = app.get(ConfigService)
  const port = configService.get('PORT')
  app.setGlobalPrefix('api/v1', { exclude: [''] })
  app.useGlobalFilters(new AllExceptionsFilter())
  await app.listen(port)
}
bootstrap()
