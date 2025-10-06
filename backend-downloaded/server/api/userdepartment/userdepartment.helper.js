const { UserDepartment, User, Department } = require('../../model');

const getUserDepartments = async (userId) => {
  return await UserDepartment.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Department,
        attributes: ['id', 'department_name', 'department_code', 'description', 'status']
      }
    ]
  });
};

const getDepartmentUsers = async (departmentId) => {
  return await UserDepartment.findAll({
    where: { department_id: departmentId },
    include: [
      {
        model: User,
        attributes: ['id', 'first_name', 'last_name', 'email', 'user_name', 'user_type', 'status']
      }
    ]
  });
};

const assignUserToDepartment = async (userId, departmentId, isPrimary = false, assignedBy = null) => {
  // If setting as primary, first remove primary flag from other departments
  if (isPrimary) {
    await UserDepartment.update(
      { is_primary: false },
      { where: { user_id: userId } }
    );
  }

  return await UserDepartment.create({
    user_id: userId,
    department_id: departmentId,
    is_primary: isPrimary,
    assigned_by: assignedBy,
    assigned_at: new Date()
  });
};

const removeUserFromDepartment = async (userId, departmentId) => {
  return await UserDepartment.destroy({ 
    where: { 
      user_id: userId, 
      department_id: departmentId 
    } 
  });
};

const setPrimaryDepartment = async (userId, departmentId) => {
  // First remove primary flag from all user's departments
  await UserDepartment.update(
    { is_primary: false },
    { where: { user_id: userId } }
  );
  
  // Then set the specified department as primary
  return await UserDepartment.update(
    { is_primary: true },
    { where: { user_id: userId, department_id: departmentId } }
  );
};

const updateUserDepartments = async (userId, departmentIds, assignedBy = null) => {
  // First remove all existing user department assignments
  await UserDepartment.destroy({ where: { user_id: userId } });
  
  // Then add new assignments
  const assignments = [];
  for (let i = 0; i < departmentIds.length; i++) {
    const departmentId = departmentIds[i];
    const isPrimary = i === 0; // First department is primary
    
    const assignment = await assignUserToDepartment(userId, departmentId, isPrimary, assignedBy);
    assignments.push(assignment);
  }
  
  return assignments;
};

const getUserPrimaryDepartment = async (userId) => {
  return await UserDepartment.findOne({
    where: { user_id: userId, is_primary: true },
    include: [
      {
        model: Department,
        attributes: ['id', 'department_name', 'department_code', 'description', 'status']
      }
    ]
  });
};

module.exports = {
  getUserDepartments,
  getDepartmentUsers,
  assignUserToDepartment,
  removeUserFromDepartment,
  setPrimaryDepartment,
  updateUserDepartments,
  getUserPrimaryDepartment
};