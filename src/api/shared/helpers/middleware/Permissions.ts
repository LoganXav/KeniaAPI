import { autoInjectable } from "tsyringe";
import { Permission } from "@prisma/client";
import RoleReadProvider from "~/api/modules/role/providers/RoleRead.provider";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { IRequest, IResponse, INextFunction } from "~/infrastructure/internal/types";
import { UnauthorizedError } from "~/infrastructure/internal/exceptions/UnauthorizedError";
import { PermissionConstantsType } from "~/api/shared/helpers/constants/Permissions.constants";
import { RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { AUTHORIZATION_REQUIRED, ROLE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class PermissionMiddleware {
  roleReadProvider: RoleReadProvider;

  constructor(roleReadProvider: RoleReadProvider) {
    this.roleReadProvider = roleReadProvider;
  }

  public checkPermission = (requiredPermission: PermissionConstantsType) => {
    return async (req: IRequest, res: IResponse, next: INextFunction) => {
      try {
        const roleId = req.body?.roleId;

        const role = await this.roleReadProvider.getOneByCriteria({
          id: roleId,
          tenantId: req.body?.tenantId,
        });

        if (!role) {
          throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(ROLE_RESOURCE));
        }

        const hasPermission = role?.permissions.some((permission: Permission) => permission.name === requiredPermission);

        if (!hasPermission) {
          throw new UnauthorizedError(AUTHORIZATION_REQUIRED);
        }

        next();
      } catch (error: any) {
        res.status(error.httpStatusCode).json({ status: "error", statusCode: error.httpStatusCode, message: error.description, result: null });
      }
    };
  };

  public checkAllPermissions = (requiredPermissions: PermissionConstantsType[]) => {
    return async (req: IRequest, res: IResponse, next: INextFunction) => {
      try {
        const roleId = req.body?.roleId;

        const role = await this.roleReadProvider.getOneByCriteria({
          id: roleId,
          tenantId: req.body?.tenantId,
        });

        const hasAllPermissions = requiredPermissions.every((requiredPermission: PermissionConstantsType) => role?.permissions.some((permission: Permission) => permission.name === requiredPermission));

        if (!hasAllPermissions) {
          throw new UnauthorizedError(AUTHORIZATION_REQUIRED);
        }

        next();
      } catch (error: any) {
        res.status(error.httpStatusCode).json({ status: "error", statusCode: error.httpStatusCode, message: error.description, result: null });
      }
    };
  };
}
