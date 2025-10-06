const moduleDAL = require('../api/module/module.helper');
const common = require('../util/common');

/**
 * Middleware to check if user has specific CRUD permission for a module
 * @param {string} moduleName - Name of the module
 * @param {string} permission - Permission type: 'create', 'read', 'update', 'delete'
 */
const checkModuleAccess = (moduleName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id || req.body?.userId || req.params?.userId;
      
      if (!userId) {
        return common.sendResponse(res, 'User ID not found', false, 401);
      }
      
      const hasAccess = await moduleDAL.checkUserModuleAccess(userId, moduleName);
      
      if (!hasAccess) {
        return common.sendResponse(res, `You don't have access to ${moduleName} module`, false, 403);
      }
      
      next();
    } catch (error) {
      console.error('Module access check error:', error);
      return common.sendResponse(res, 'Module access check failed', false, 500);
    }
  };
};


/**
 * Attach user permissions to request object
 */
const attachUserPermissions = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body?.userId || req.params?.userId;
    
    if (userId) {
      const userModules = await moduleDAL.getUserModulesWithDetails(userId);
      req.userPermissions = userModules.reduce((acc, module) => {
        acc[module.module.name] = module.permissions;
        return acc;
      }, {});
    }
    
    next();
  } catch (error) {
    console.error('Error attaching user permissions:', error);
    next(); // Continue even if permissions can't be attached
  }
};

module.exports = {
  checkModuleAccess,
  attachUserPermissions
};