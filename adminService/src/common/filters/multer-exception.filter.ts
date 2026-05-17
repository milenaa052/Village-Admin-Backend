import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus} from '@nestjs/common';

@Catch()
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if ( exception && (exception.name === 'MulterError' || exception.code)) {
      if ( exception.code === 'LIMIT_FILE_SIZE' || /file size|File too large/i.test(exception.message || '')) {
        return response
          .status(HttpStatus.PAYLOAD_TOO_LARGE)
          .json({
            statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
            message: 'Arquivo muito grande. Máximo permitido: 5MB.',
          });
      }

      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: exception.message || 'Erro no upload.'});
    }
    throw exception;
  }
}