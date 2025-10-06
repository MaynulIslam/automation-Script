const DatabaseHelper = require('../../util/databaseHelper');
const { License } = require('../../model');

const licenseHelper = new DatabaseHelper(License);

const insertLicense = async (data) => {
  return await licenseHelper.create(data);
};

const updateLicense = async (id, data) => {
  return await licenseHelper.update(id, data);
};

const deleteLicense = async (id) => {
  return await licenseHelper.delete(id);
};

const getLicense = async (id) => {
  return await licenseHelper.findByPk(id);
};

const getAllLicenses = async () => {
  return await licenseHelper.findAll();
};


module.exports = {
  insertLicense,
  updateLicense,
  deleteLicense,
  getLicense,
  getAllLicenses,
};
