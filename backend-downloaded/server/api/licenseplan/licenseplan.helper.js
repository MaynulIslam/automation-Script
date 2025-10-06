const DatabaseHelper = require('../../util/databaseHelper');
const { LicensePlan } = require('../../model');

const licensePlanHelper = new DatabaseHelper(LicensePlan);

const insertLicensePlan = async (data) => {
  return await licensePlanHelper.create(data);
};

const updateLicensePlan = async (id, data) => {
  return await licensePlanHelper.update(id, data);
};

const deleteLicensePlan = async (id) => {
  return await licensePlanHelper.delete(id);
};

const getLicensePlan = async (id) => {
  return await licensePlanHelper.findByPk(id);
};

const getAllLicensePlans = async () => {
  return await licensePlanHelper.findAll();
};

const getLicensePlanByCode = async (code) => {
  try {
    return await licensePlanHelper.findOne({ code });
  } catch (error) {
    console.error("Error in getLicensePlanByCode:", error);
    throw error;
  }
};

const insertMultipleLicensePlans = async (licensePlansArray) => {
  try {
    // Convert features to JSON string if needed
    const formattedPlans = licensePlansArray.map(plan => ({
      ...plan,
      features: JSON.stringify(plan.features)
    }));

    const result = await licensePlanHelper.bulkCreate(formattedPlans);
    console.info(`Successfully inserted ${result.length} license plans`);
    return result;
  } catch (error) {
    console.error('Error inserting license plans:', error);
    throw error;
  }
};

module.exports = {
  insertLicensePlan,
  updateLicensePlan,
  deleteLicensePlan,
  getLicensePlan,
  getAllLicensePlans,
  getLicensePlanByCode,
  insertMultipleLicensePlans
};
