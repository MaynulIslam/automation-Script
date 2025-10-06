const common = require('../../util/common');
const constant = require('../../util/constant');
const departmentDAL = require('./department.helper');

exports.getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await departmentDAL.getDepartment(id);
    if (!department) {
      return common.sendResponse(res, constant.requestMessages.DEPARTMENT_NOT_FOUND, false, 404);
    }
    common.sendResponse(res, department, true, 200);
  } catch (error) {
    console.error('Error retrieving department:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_DEPARTMENT, false, 500);
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await departmentDAL.getDepartments();
    if (!departments || departments.length === 0) {
      return common.sendResponse(res, constant.requestMessages.NO_DEPARTMENTS_FOUND, false, 404);
    }
    common.sendResponse(res, departments, true, 200);
  } catch (error) {
    console.error('Error retrieving departments:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_DEPARTMENTS, false, 500);
  }
};

exports.insertDepartment = async (req, res) => {
  try {
    const { department_name, department_code, description, status = 1 } = req.body;

    // Check if department code already exists
    const existingDepartment = await departmentDAL.getDepartmentByCode(department_code);
    if (existingDepartment) {
      return common.sendResponse(res, constant.requestMessages.DEPARTMENT_CODE_ALREADY_EXISTS, false, 400);
    }

    const newDepartment = await departmentDAL.insertDepartment({ 
      department_name, 
      department_code, 
      description, 
      status 
    });

    common.sendResponse(res, newDepartment, true, 201, constant.requestMessages.DEPARTMENT_CREATED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error inserting department:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_DEPARTMENT, false, 500);
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { department_name, department_code, description, status } = req.body;

    const department = await departmentDAL.getDepartment(id);
    if (!department) {
      return common.sendResponse(res, constant.requestMessages.DEPARTMENT_NOT_FOUND, false, 404);
    }

    // Check if department code already exists (excluding current department)
    if (department_code && department_code !== department.department_code) {
      const existingDepartment = await departmentDAL.getDepartmentByCode(department_code);
      if (existingDepartment) {
        return common.sendResponse(res, constant.requestMessages.DEPARTMENT_CODE_ALREADY_EXISTS, false, 400);
      }
    }

    const updatedDepartment = await departmentDAL.updateDepartment({
      id,
      department_name,
      department_code,
      description,
      status
    });

    common.sendResponse(res, updatedDepartment, true, 200, constant.requestMessages.DEPARTMENT_UPDATED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error updating department:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_UPDATE_DEPARTMENT, false, 500);
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await departmentDAL.getDepartment(id);
    if (!department) {
      return common.sendResponse(res, constant.requestMessages.DEPARTMENT_NOT_FOUND, false, 404);
    }

    await departmentDAL.deleteDepartment(id);
    common.sendResponse(res, constant.requestMessages.DEPARTMENT_DELETED_SUCCESSFULLY, true, 200);
  } catch (error) {
    console.error('Error deleting department:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_DELETE_DEPARTMENT, false, 500);
  }
};