import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest();

        const isHttpException = exception instanceof HttpException;
        const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const resBody = isHttpException ? exception.getResponse() : null;

        let message = 'Internal server error';
        if (typeof resBody === 'string') {
            message = resBody;
        } else if (typeof resBody === 'object' && resBody !== null && 'message' in resBody) {
            message = (resBody as { message?: string }).message ?? message;
        } else if (!isHttpException && exception instanceof Error) {
            message = exception.message;
        }

        const errorCode = HttpStatus[status] ?? 'UNKNOWN_ERROR';

        response.status(status).send({
            statusCode: status,
            errorCode,
            message,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}