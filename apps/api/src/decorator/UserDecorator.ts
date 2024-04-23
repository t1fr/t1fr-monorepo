import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Member } from "@t1fr/legacy/management";
import { Request } from "express";

export const User = createParamDecorator((data: keyof Omit<Member, "isExist">, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>();
  return data ? request.user[data] : request.user;
});
