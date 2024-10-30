import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type UserId = string | null;

export const UserIdParam = createParamDecorator(
  (_: unknown, context: ExecutionContext): UserId => {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.user?.userId) return null;
    return request.user?.userId;
  },
);
