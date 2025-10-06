const common = require('../../util/common');
const constant = require('../../util/constant');
const userDepartmentDAL = require('./userdepartment.helper');

exports.getUserDepartments = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDepartments = await userDepartmentDAL.getUserDepartments(userId);
    
    common.sendResponse(res, userDepartments || [], true, 200);
  } catch (error) {
    console.error('Error retrieving user departments:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_USER_DEPARTMENTS, false, 500);
  }
};

exports.getDepartmentUsers = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const departmentUsers = await userDepartmentDAL.getDepartmentUsers(departmentId);
    
    common.sendResponse(res, departmentUsers || [], true, 200);
  } catch (error) {
    console.error('Error retrieving department users:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_DEPARTMENT_USERS, false, 500);
  }
};

exports.assignUserToDepartment = async (req, res) => {
  try {
    const { user_id, department_id, is_primary = false } = req.body;
    const assigned_by = req.user ? req.user.id : null;

    if (!user_id || !department_id) {
      return common.sendResponse(res, constant.requestMessages.USER_ID_AND_DEPARTMENT_ID_REQUIRED, false, 400);
    }

    const assignment = await userDepartmentDAL.assignUserToDepartment(
      user_id, 
      department_id, 
      is_primary, 
      assigned_by
    );

    common.sendResponse(res, assignment, true, 201, constant.requestMessages.USER_ASSIGNED_TO_DEPARTMENT_SUCCESSFULLY);
  } catch (error) {
    console.error('Error assigning user to department:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_ASSIGN_USER_TO_DEPARTMENT, false, 500);
  }
};

exports.updateUserDepartments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { department_ids } = req.body;
    const assigned_by = req.user ? req.user.id : null;

    if (!department_ids || !Array.isArray(department_ids)) {
      return common.sendResponse(res, constant.requestMessages.DEPARTMENT_IDS_REQUIRED, false, 400);
    }

    const assignments = await userDepartmentDAL.updateUserDepartments(userId, department_ids, assigned_by);

    common.sendResponse(res, assignments, true, 200, constant.requestMessages.USER_DEPARTMENTS_UPDATED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error updating user departments:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_UPDATE_USER_DEPARTMENTS, false, 500);
  }
};

exports.removeUserFromDepartment = async (req, res) => {
  try {
    const { userId, departmentId } = req.params;

    await userDepartmentDAL.removeUserFromDepartment(userId, departmentId);
    common.sendResponse(res, constant.requestMessages.USER_REMOVED_FROM_DEPARTMENT_SUCCESSFULLY, true, 200);
  } catch (error) {
    console.error('Error removing user from department:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_REMOVE_USER_FROM_DEPARTMENT, false, 500);
  }
};

exports.setPrimaryDepartment = async (req, res) => {
  try {
    const { userId, departmentId } = req.params;

    await userDepartmentDAL.setPrimaryDepartment(userId, departmentId);
    common.sendResponse(res, constant.requestMessages.PRIMARY_DEPARTMENT_SET_SUCCESSFULLY, true, 200);
  } catch (error) {
    console.error('Error setting primary department:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_SET_PRIMARY_DEPARTMENT, false, 500);
  }
};