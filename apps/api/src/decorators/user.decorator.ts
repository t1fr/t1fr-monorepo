import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Member } from "@t1fr/legacy/management";

export const User = createParamDecorator((data: keyof Omit<Member, "isExist">, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>();
  return data ? request.user[data] : request.user;
});
