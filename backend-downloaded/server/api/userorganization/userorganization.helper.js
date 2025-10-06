const DatabaseHelper = require('../../util/databaseHelper');

const { UserOrganization } = require('../../model');
const userOrganizationHelper = new DatabaseHelper(UserOrganization);

const insertUserOrganization = async (data) => {
  return await userOrganizationHelper.create(data);
};

const updateUserOrganization = async (data) => {
  return await userOrganizationHelper.update(data);
};

const deleteUserOrganization = async (id) => {
  return await userOrganizationHelper.delete(id);
};

const getUserOrganization = async (id) => {
  return await userOrganizationHelper.findByPk(id);
};

const getAllUserOrganizations = async () => {
  return await userOrganizationHelper.findAll();
};

module.exports = {
  insertUserOrganization,
  updateUserOrganization,
  deleteUserOrganization,
  getUserOrganization,
  getAllUserOrganizations
};
