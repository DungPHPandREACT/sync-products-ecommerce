import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? (exception as HttpException).getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract message and errors consistently
    let message: string = 'Internal server error';
    let errors: unknown = undefined;

    if (isHttpException) {
      const res = (exception as HttpException).getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res) {
        const body: any = res;
        message = body.message || body.error || message;
        errors = body.errors || body.message || undefined;
      }
    } else if (exception && typeof (exception as any).message === 'string') {
      message = (exception as any).message;
    }

    response.status(status).json({
      status: 'error',
      statusCode: status,
      path: request?.url,
      message,
      errors,
    });
  }
}


