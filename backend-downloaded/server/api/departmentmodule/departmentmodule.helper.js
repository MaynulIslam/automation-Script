const { DepartmentModule, Department, Module } = require('../../model');

const getDepartmentModules = async (departmentId) => {
  return await DepartmentModule.findAll({
    where: { department_id: departmentId },
    include: [
      {
        model: Module,
        attributes: ['id', 'module_name', 'module_type', 'description', 'status']
      }
    ]
  });
};

const getModuleDepartments = async (moduleId) => {
  return await DepartmentModule.findAll({
    where: { module_id: moduleId },
    include: [
      {
        model: Department,
        attributes: ['id', 'department_name', 'department_code', 'description', 'status']
      }
    ]
  });
};

const assignModuleToDepartment = async (departmentId, moduleId, permissions, assignedBy = null) => {
  const {
    can_view = false,
    can_add_edit = false,
    can_delete = false
  } = permissions;

  return await DepartmentModule.create({
    department_id: departmentId,
    module_id: moduleId,
    can_view,
    can_add_edit,
    can_delete,
    assigned_by: assignedBy,
    assigned_at: new Date()
  });
};

const removeModuleFromDepartment = async (departmentId, moduleId) => {
  return await DepartmentModule.destroy({ 
    where: { 
      department_id: departmentId, 
      module_id: moduleId 
    } 
  });
};

const updateDepartmentModules = async (departmentId, modulePermissions, assignedBy = null) => {
  // First remove all existing department module assignments
  await DepartmentModule.destroy({ where: { department_id: departmentId } });
  
  // Then add new assignments
  const assignments = [];
  for (const modulePermission of modulePermissions) {
    const { module_id, can_view, can_add_edit, can_delete } = modulePermission;
    
    const assignment = await assignModuleToDepartment(
      departmentId, 
      module_id, 
      { can_view, can_add_edit, can_delete }, 
      assignedBy
    );
    assignments.push(assignment);
  }
  
  return assignments;
};

const updateDepartmentModulePermissions = async (departmentId, moduleId, permissions) => {
  return await DepartmentModule.update(permissions, {
    where: { 
      department_id: departmentId, 
      module_id: moduleId 
    }
  });
};

module.exports = {
  getDepartmentModules,
  getModuleDepartments,
  assignModuleToDepartment,
  removeModuleFromDepartment,
  updateDepartmentModules,
  updateDepartmentModulePermissions
};