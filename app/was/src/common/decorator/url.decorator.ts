import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const Url = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const fullUrl: string = req.fullUrl;

    if (!fullUrl) {
      throw new InternalServerErrorException(
        'Request에 fullUrl이 존재하지 않습니다.',
      );
    }

    return fullUrl;
  },
);
