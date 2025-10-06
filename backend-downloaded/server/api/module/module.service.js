const common = require('../../util/common');
const constant = require('../../util/constant');
const moduleDAL = require('./module.helper');

exports.getModule = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await moduleDAL.getModule(id);
    if (!module) {
      return common.sendResponse(res, constant.requestMessages.MODULE_NOT_FOUND, false, 404);
    }
    common.sendResponse(res, module, true, 200);
  } catch (error) {
    console.error('Error retrieving module:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_MODULE, false, 500);
  }
};

exports.getAllModules = async (req, res) => {
  try {
    const modules = await moduleDAL.getAllModules();
    if (!modules || modules.length === 0) {
      return common.sendResponse(res, constant.requestMessages.NO_MODULES_FOUND, false, 404);
    }
    common.sendResponse(res, modules, true, 200);
  } catch (error) {
    console.error('Error retrieving modules:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_MODULES, false, 500);
  }
};

exports.insertModule = async (req, res) => {
  try {
    const { module_name, module_type, status } = req.body;

    const newModule = await moduleDAL.insertModule({ module_name, module_type, status });

    common.sendResponse(res, newModule, true, 201, constant.requestMessages.MODULE_CREATED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error inserting module:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_MODULE, false, 500);
  }
};

exports.updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { module_name, module_type, status } = req.body;

    const module = await moduleDAL.getModule(id);
    if (!module) {
      return common.sendResponse(res, constant.requestMessages.MODULE_NOT_FOUND, false, 404);
    }

    module.module_name = module_name;
    module.module_type = module_type;
    module.status = status;

    await moduleDAL.updateModule(module);

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.MODULE_UPDATED_SUCCESSFULLY,
      module,
    }, true, 200);
  } catch (error) {
    console.error('Error updating module:', error);
    common.sendResponse(res, constant.requestMessages.ERROR_MODULE_UPDATE, false, 500);
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await moduleDAL.getModule(id);
    if (!module) {
      return common.sendResponse(res, constant.requestMessages.MODULE_NOT_FOUND, false, 404);
    }

    await moduleDAL.deleteModule(id);

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.MODULE_DELETED_SUCCESSFULLY,
    }, true, 200);
  } catch (error) {
    console.error('Error deleting module:', error);
    common.sendResponse(res, constant.requestMessages.ERROR_MODULE_DELETE, false, 500);
  }
};

exports.getUserModules = async (req, res) => {
  try {
    const { userId } = req.params;
    const userModules = await moduleDAL.getUserModulesWithDetails(userId);
    common.sendResponse(res, userModules, true, 200);
  } catch (error) {
    console.error('Error retrieving user modules:', error);
    common.sendResponse(res, 'Failed to retrieve user modules', false, 500);
  }
};

exports.updateUserModules = async (req, res) => {
  try {
    const { userId } = req.params;
    const { moduleIds, modules } = req.body;
    
    // Support both old format (moduleIds) and new format (modules with permissions)
    const modulesToUpdate = modules || moduleIds;
    
    const result = await moduleDAL.updateUserModules(userId, modulesToUpdate);
    
    common.sendResponse(res, {
      success: true,
      message: 'User modules updated successfully',
      data: result,
    }, true, 200);
  } catch (error) {
    console.error('Error updating user modules:', error);
    common.sendResponse(res, 'Failed to update user modules', false, 500);
  }
};
