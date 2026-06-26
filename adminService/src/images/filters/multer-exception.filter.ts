import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { MulterError } from 'multer';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()

    if (exception.code === 'LIMIT_FILE_SIZE') {
      return response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        message: 'Arquivo muito grande. Máximo permitido: 5MB.'
      })
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message ?? 'Erro no upload.'
    })
  }
}