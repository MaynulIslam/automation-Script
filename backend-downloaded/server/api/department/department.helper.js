const { Department } = require('../../model');

const insertDepartment = async (data) => {
  return await Department.create(data);
};

const updateDepartment = async (data) => {
  return await Department.update(data, { where: { id: data.id } });
};

const deleteDepartment = async (id) => {
  return await Department.destroy({ where: { id } });
};

const getDepartment = async (id) => {
  return await Department.findByPk(id);
};

const getDepartments = async () => {
  return await Department.findAll();
};

const getDepartmentByCode = async (department_code) => {
  return await Department.findOne({ where: { department_code } });
};

module.exports = {
  insertDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  getDepartmentByCode
};