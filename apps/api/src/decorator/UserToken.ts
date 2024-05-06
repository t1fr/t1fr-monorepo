import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { UserPayload } from "../types";

export const UserToken = createParamDecorator((propertyKey: keyof UserPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return propertyKey ? request.user.data[propertyKey] : request.user;
});
