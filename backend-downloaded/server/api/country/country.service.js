const common = require('../../util/common');
const constant = require('../../util/constant');
const countryDAL = require('./country.helper');

exports.getAllCountries = async (req, res) => {
  try {
    const countries = await countryDAL.getAllCountries();
    if (!countries || countries.length === 0) {
      return common.sendResponse(res, constant.requestMessages.COUNTRY_NOT_FOUND, false, 404);
    }
    common.sendResponse(res, {
      success: true,
      countries,
    }, true, 200);
  } catch (error) {
    console.error('Error fetching countries:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_COUNTRIES, false, 500);
  }
}; 