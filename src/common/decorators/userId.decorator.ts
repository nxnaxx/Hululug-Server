import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { stringToObjectId } from 'src/utils';

export type UserId = Types.ObjectId | null;

export const UserIdParam = createParamDecorator(
  (_: unknown, context: ExecutionContext): UserId => {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.user?.userId) return null;
    return stringToObjectId(request.user?.userId);
  },
);
