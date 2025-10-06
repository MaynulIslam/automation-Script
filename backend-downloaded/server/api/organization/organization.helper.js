const DatabaseHelper = require('../../util/databaseHelper');
const { Organization } = require('../../model');

const organizationHelper = new DatabaseHelper(Organization);

const insertOrganization = async (data) => {
  return await organizationHelper.create(data);
};

const updateOrganization = async (id, data) => {
  return await organizationHelper.update(id, data);
};

const deleteOrganization = async (id) => {
  return await organizationHelper.delete(id);
};

const getOrganization = async (id) => {
  return await organizationHelper.findByPk(id);
};

const getAllOrganizations = async () => {
  return await organizationHelper.findAll();
};

module.exports = {
  insertOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganization,
  getAllOrganizations,
};
