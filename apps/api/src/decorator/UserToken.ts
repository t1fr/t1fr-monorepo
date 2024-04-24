import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { UserPayload } from "../types";

export const UserToken = createParamDecorator((propertyKey: keyof UserPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return propertyKey ? request.user.data[propertyKey] : request.user;
});
