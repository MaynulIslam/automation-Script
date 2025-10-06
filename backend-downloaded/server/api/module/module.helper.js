const { Module, UserModule, User } = require('../../model');

const insertModule = async (data) => {
  return await Module.create(data);
};

const updateModule = async (data) => {
  return await Module.update(data, { where: { id: data.id } });
};

const deleteModule = async (id) => {
  return await Module.destroy({ where: { id } });
};

const getModule = async (id) => {
  return await Module.findByPk(id);
};

const getAllModules = async () => {
  return await Module.findAll();
};

const createModule = async (moduleData) => {
  return await Module.create(moduleData);
};

const getUserModules = async (userId) => {
  return await UserModule.findAll({ where: { UserId: userId } });
};

const updateUserModules = async (userId, modules) => {
  // Delete existing user modules
  await UserModule.destroy({ where: { UserId: userId } });
  
  // Handle both old format (moduleIds array) and new format (modules with permissions)
  if (Array.isArray(modules) && modules.length > 0) {
    // Check if old format (array of IDs)
    if (typeof modules[0] === 'number') {
      // Old format - convert to new format with default permissions
      const userModules = modules.map(moduleId => ({
        UserId: userId,
        ModuleId: moduleId,
        can_view: true,
        can_add_edit: false,
        can_delete: false,
        status: 1
      }));
      return await UserModule.bulkCreate(userModules);
    } else {
      // New format - modules with permissions
      const userModules = modules.map(module => ({
        UserId: userId,
        ModuleId: module.moduleId,
        can_view: module.permissions?.can_view || false,
        can_add_edit: module.permissions?.can_add_edit || false,
        can_delete: module.permissions?.can_delete || false,
        status: 1
      }));
      return await UserModule.bulkCreate(userModules);
    }
  }
  
  return [];
};

const getUserModulesWithDetails = async (userId) => {
  const userModules = await UserModule.findAll({
    where: { UserId: userId },
    include: [{
      model: Module,
      attributes: ['id', 'module_name', 'module_type', 'status']
    }]
  });
  
  return userModules.map(um => ({
    moduleId: um.ModuleId,
    module: {
      id: um.Module.id,
      name: um.Module.module_name,
      displayName: um.Module.module_name,
      type: um.Module.module_type,
      status: um.Module.status
    },
    permissions: {
      can_view: um.can_view,
      can_add_edit: um.can_add_edit,
      can_delete: um.can_delete
    }
  }));
};

const checkUserModuleAccess = async (userId, moduleName) => {
  const user = await User.findByPk(userId);
  
  // Admin users (user_type = 1) have access to all modules
  if (user && (user.user_type === 1 || user.user_type === '1')) {
    return true;
  }
  
  // Check if user has access to the module
  const modulePermission = await UserModule.findOne({
    include: [{
      model: Module,
      where: { module_name: moduleName }
    }],
    where: { UserId: userId }
  });
  
  return modulePermission ? modulePermission.can_view : false;
};

module.exports = {
  insertModule,
  updateModule,
  deleteModule,
  getModule,
  getAllModules,
  createModule,
  getUserModules,
  updateUserModules,
  getUserModulesWithDetails,
  checkUserModuleAccess,
};
