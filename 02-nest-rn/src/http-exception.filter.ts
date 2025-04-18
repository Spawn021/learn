import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // Xác định status code từ exception
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    // Lấy message từ exception nếu có, nếu không thì dùng message mặc định
    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error'

    // Kiểm tra nếu exception là lỗi không phải HttpException
    if (exception instanceof Error) {
      // Nếu exception là một Error, ghi log toàn bộ thông tin về lỗi
      this.logger.error(exception.stack)
      message = exception.message // Lấy thông báo lỗi từ message
    }

    // Ghi log lỗi ra console với thông tin chi tiết
    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Message: ${JSON.stringify(message)}`,
    )

    // Trả về response với thông tin chi tiết hơn
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
    })
  }
}
