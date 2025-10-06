const common = require('../../util/common');
const constant = require('../../util/constant');
const departmentModuleDAL = require('./departmentmodule.helper');

exports.getDepartmentModules = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const departmentModules = await departmentModuleDAL.getDepartmentModules(departmentId);
    
    common.sendResponse(res, departmentModules || [], true, 200);
  } catch (error) {
    console.error('Error retrieving department modules:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_DEPARTMENT_MODULES, false, 500);
  }
};

exports.getModuleDepartments = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const moduleDepartments = await departmentModuleDAL.getModuleDepartments(moduleId);
    
    common.sendResponse(res, moduleDepartments || [], true, 200);
  } catch (error) {
    console.error('Error retrieving module departments:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_MODULE_DEPARTMENTS, false, 500);
  }
};

exports.assignModuleToDepartment = async (req, res) => {
  try {
    const { 
      department_id, 
      module_id, 
      can_view = false, 
      can_add_edit = false, 
      can_delete = false 
    } = req.body;
    const assigned_by = req.user ? req.user.id : null;

    if (!department_id || !module_id) {
      return common.sendResponse(res, constant.requestMessages.DEPARTMENT_ID_AND_MODULE_ID_REQUIRED, false, 400);
    }

    const assignment = await departmentModuleDAL.assignModuleToDepartment(
      department_id, 
      module_id, 
      { can_view, can_add_edit, can_delete }, 
      assigned_by
    );

    common.sendResponse(res, assignment, true, 201, constant.requestMessages.MODULE_ASSIGNED_TO_DEPARTMENT_SUCCESSFULLY);
  } catch (error) {
    console.error('Error assigning module to department:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_ASSIGN_MODULE_TO_DEPARTMENT, false, 500);
  }
};

exports.updateDepartmentModules = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { module_permissions } = req.body;
    const assigned_by = req.user ? req.user.id : null;

    if (!module_permissions || !Array.isArray(module_permissions)) {
      return common.sendResponse(res, constant.requestMessages.MODULE_PERMISSIONS_REQUIRED, false, 400);
    }

    const assignments = await departmentModuleDAL.updateDepartmentModules(departmentId, module_permissions, assigned_by);

    common.sendResponse(res, assignments, true, 200, constant.requestMessages.DEPARTMENT_MODULES_UPDATED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error updating department modules:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_UPDATE_DEPARTMENT_MODULES, false, 500);
  }
};

exports.removeModuleFromDepartment = async (req, res) => {
  try {
    const { departmentId, moduleId } = req.params;

    await departmentModuleDAL.removeModuleFromDepartment(departmentId, moduleId);
    common.sendResponse(res, constant.requestMessages.MODULE_REMOVED_FROM_DEPARTMENT_SUCCESSFULLY, true, 200);
  } catch (error) {
    console.error('Error removing module from department:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_REMOVE_MODULE_FROM_DEPARTMENT, false, 500);
  }
};