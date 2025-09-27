const AppError = require("../errors/AppError");

const UserPermissionsService = require("../services/UserPermissions.service");
const { UsersService } = require("../services");
const { Users, SubPermissions, UserPermissions } = require("../models");

class MiddlewarePermissions {
  static async getUserPermissions(id) {
    const user = await Users.findOne({
      where: { id },
      include: [
        {
          model: UserPermissions,
          as: "userpermission",
          attributes: ["id", "permission_type", "permission_id"],
        },
      ],
    });

    if (!user) {
      throw new AppError(404, "Usuário não encontrado");
    }

    const userPermissions = user.userpermission || [];

    if (!user) {
      throw new AppError(404, "Usuário não encontrado");
    }

    const subPermissionIds = userPermissions.map((perm) => perm.permission_id);

    return {
      subPermissionIds,
      role: user.role,
      viewType: user.view_type_modules,
    };
  }

  static async getAllPermissions(permissions) {
    if (!permissions) {
      throw new AppError(400, "Nenhuma permissão encontrada");
    }

    const userPermission = await SubPermissions.findAll({
      attributes: ["id", "subpermission_name"],
      where: {
        id: permissions,
      },
      raw: true,
    });

    return userPermission;
  }

  static async productAccess(req, res, next) {
    try {
      const userId = req.userId;

      const userPermission =
        await UserPermissionsService.getPermissionsByUserIdSubPermission(
          userId
        );

      const hasAccessPermission = userPermission.some((elem) => {
        return elem.subpermission_name === "Catálogo de produtos";
      });

      if (hasAccessPermission) {
        return next();
      }

      return res.status(401).json({ message: "Acesso não autorizado" });
    } catch (error) {
      console.error(error);
      next(new AppError(error.statusCode, error.message));
    }
  }

  static async reviewsAccess(req, res, next) {
    try {
      const userId = req.userId;
      const userPermission =
        await UserPermissionsService.getPermissionsByUserIdSubPermission(
          userId
        );

      const hasAccessPermission = userPermission.some((elem) => {
        return elem.subpermission_name === "Avaliações de produtos";
      });

      if (hasAccessPermission) {
        return next();
      }

      return res.status(401).json({ message: "Acesso não autorizado" });
    } catch (error) {
      console.error(error);
      next(new AppError(error.statusCode, error.message));
    }
  }

  static async paramsAccess(req, res, next) {
    try {
      const userId = req.userId;
      const userPermission =
        await UserPermissionsService.getPermissionsByUserIdSubPermission(
          userId
        );

      const hasAccessPermission = userPermission.some((elem) => {
        return elem.subpermission_name === "Acessos";
      });

      if (hasAccessPermission) {
        return next();
      }

      return res.status(401).json({ message: "Acesso não autorizado" });
    } catch (error) {
      console.error(error);
      next(new AppError(error.statusCode, error.message));
    }
  }

  static async kioskOrdersAccess(req, res, next) {
    try {
      const userId = req.userId;
      const userPermission =
        await UserPermissionsService.getPermissionsByUserIdSubPermission(
          userId
        );

      const hasAccessPermission = userPermission.some((elem) => {
        return elem.subpermission_name === "Quiosques";
      });

      if (hasAccessPermission) {
        return next();
      }

      return res.status(401).json({ message: "Acesso não autorizado" });
    } catch (error) {
      console.error(error);
      next(new AppError(error.statusCode, error.message));
    }
  }

  // OBJECTIVES NÃO É MAIS UTILIZADO
  // static async objectivesAccess(req, res, next) {
  //   try {
  //     const userId = req.userId;
  //     const userPermission =
  //       await UserPermissionsService.getPermissionsByUserIdSubPermission(
  //         userId
  //       );

  //     const hasAccessPermission = userPermission.some((elem) => {
  //       return elem.subpermission_name === "Metas & Objetivos";
  //     });

  //     if (hasAccessPermission) {
  //       return next();
  //     }

  //     return res.status(401).json({ message: "Acesso não autorizado" });
  //   } catch (error) {
  //     // Log do erro e resposta genérica para outros erros
  //     console.error(error);
  //     return res
  //       .status(error.statusCode ?? 500)
  //       .json({ message: error.message ?? "Houve um erro" });
  //   }
  // }

  // KITS NÃO É MAIS UTILIZADO
  // static async kitsAccess(req, res, next) {
  //   try {
  //     const userId = req.userId;
  //     const userPermission =
  //       await UserPermissionsService.getPermissionsByUserIdSubPermission(
  //         userId
  //       );

  //     const hasAccessPermission = userPermission.some((elem) => {
  //       return elem.subpermission_name === "Gestão de Kits";
  //     });

  //     if (hasAccessPermission) {
  //       return next();
  //     }

  //     return res.status(401).json({ message: "Acesso não autorizado" });
  //   } catch (error) {
  //     console.error(error);
  //     return res
  //       .status(error.statusCode ?? 500)
  //       .json({ message: error.message ?? "Houve um erro" });
  //   }
  // }

  static async managerAccess(req, res, next) {
    try {
      const userId = req.userId;

      const userDelete = await Users.findByPk(userId);

      const userPermission =
        await UserPermissionsService.getPermissionsByUserIdSubPermission(
          userId
        );

      const hasAccessPermission = userPermission.some((elem) => {
        return elem.subpermission_name === "Acessos";
      });

      if (hasAccessPermission) {
        req.deleteUser = userDelete.mail;
        return next();
      }

      return res.status(401).json({ message: "Acesso não autorizado" });
    } catch (error) {
      // Log do erro e resposta genérica para outros erros
      console.error(error);
      return res
        .status(error.statusCode ?? 500)
        .json({ message: error.message ?? "Houve um erro" });
    }
  }

  static async dashboardAccess(req, res, next) {
    try {
      const userId = req.userId;
      const userPermission =
        await UserPermissionsService.getPermissionsByUserIdSubPermission(
          userId
        );

      const hasAccessPermission = userPermission.some((elem) => {
        return elem.subpermission_name === "Dados Transacionais";
      });

      if (hasAccessPermission) {
        return next();
      }

      return res.status(401).json({ message: "Acesso não autorizado" });
    } catch (error) {
      console.error(error);
      return res
        .status(error.statusCode ?? 500)
        .json({ message: error.message ?? "Houve um erro" });
    }
  }

  static async ordersAccess(req, res, next) {
    try {
      const userId = req.userId;
      const userPermission =
        await UserPermissionsService.getPermissionsByUserIdSubPermission(
          userId
        );

      const hasAccessPermission = userPermission.some((elem) => {
        return elem.subpermission_name === "Retiradas Quiosque";
      });

      if (hasAccessPermission) {
        return next();
      }

      return res.status(401).json({ message: "Acesso não autorizado" });
    } catch (error) {
      console.error(error);
      return res
        .status(error.statusCode ?? 500)
        .json({ message: error.message ?? "Houve um erro" });
    }
  }

  static async brandsAccess(req, res, next) {
    try {
      const userId = req.userId;
      const userPermission =
        await UserPermissionsService.getPermissionsByUserIdSubPermission(
          userId
        );

      const hasAccessPermission = userPermission.some((elem) => {
        return elem.subpermission_name === "Marcas";
      });

      if (hasAccessPermission) {
        return next();
      }

      return res.status(401).json({ message: "Acesso não autorizado" });
    } catch (error) {
      console.error(error);
      return res
        .status(error.statusCode ?? 500)
        .json({ message: error.message ?? "Houve um erro" });
    }
  }

  static async campaignsAccess(req, res, next) {
    try {
      const userId = req.userId;
      const userPermission =
        await UserPermissionsService.getPermissionsByUserIdSubPermission(
          userId
        );

      const hasAccessPermission = userPermission.some((elem) => {
        return elem.subpermission_name === "Campanhas";
      });

      if (hasAccessPermission) {
        return next();
      }

      return res.status(401).json({ message: "Acesso não autorizado" });
    } catch (error) {
      console.error(error);
      return res
        .status(error.statusCode ?? 500)
        .json({ message: error.message ?? "Houve um erro" });
    }
  }

  static async offersAccess(req, res, next) {
    try {
      const userId = req.userId;
      const userPermission =
        await UserPermissionsService.getPermissionsByUserIdSubPermission(
          userId
        );

      const hasAccessPermission = userPermission.some((elem) => {
        return elem.subpermission_name === "Ofertas";
      });

      if (hasAccessPermission) {
        return next();
      }

      return res.status(401).json({ message: "Acesso não autorizado" });
    } catch (error) {
      console.error(error);
      return res
        .status(error.statusCode ?? 500)
        .json({ message: error.message ?? "Houve um erro" });
    }
  }

  static async orderbumpsAccess(req, res, next) {
    try {
      const userId = req.userId;
      const userPermission =
        await UserPermissionsService.getPermissionsByUserIdSubPermission(
          userId
        );

      const hasAccessPermission = userPermission.some((elem) => {
        return elem.subpermission_name === "Orderbumps";
      });

      if (hasAccessPermission) {
        return next();
      }

      return res.status(401).json({ message: "Acesso não autorizado" });
    } catch (error) {
      console.error(error);
      return res
        .status(error.statusCode ?? 500)
        .json({ message: error.message ?? "Houve um erro" });
    }
  }

  static async subscriptionAccessPermission(req, res, next) {
    const { subPermissionIds, role } =
      await MiddlewarePermissions.getUserPermissions(req.userId);

    const user = await Users.findByPk(req.userId);

    const permissions =
      await MiddlewarePermissions.getAllPermissions(subPermissionIds);

    const isSubscriptionCenter = permissions.some(
      (perm) => perm.subpermission_name === "Central de Assinaturas"
    );

    if (!isSubscriptionCenter && role !== "Administrador") {
      return res
        .status(403)
        .json({ message: "Você não tem permissão para acessar este recurso" });
    }

    req.user = user;

    return next();
  }
  catch(error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}

module.exports = MiddlewarePermissions;
