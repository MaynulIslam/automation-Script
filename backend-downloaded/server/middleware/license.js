const { getActiveLicense, checkActiveLicense } = require("../api/license/license.service");
const common = require('../util/common');
const constant = require('../util/constant');

module.exports.verifyLicense = async (req, res, next) => {
  try {
    // Get the current license status and handle potential undefined
    const result = await checkActiveLicense();
    if (!result || !result.isLicensed) {
      return common.sendResponse(res, constant.requestMessages.LICENSE_REQUIRED, false, 403);
    }

    const { isLicensed, license } = result;

    // Better date comparison
    if (license) {
      const expiryDate = new Date(license.expiry_date);
      const now = new Date();
      if (isNaN(expiryDate.getTime())) {
        throw new Error('Invalid expiry date format');
      }
      if (expiryDate.getTime() < now.getTime()) {
        return common.sendResponse(res, constant.requestMessages.LICENSE_EXPIRED, false, 403);
      }
    }

    // Add license info to request for potential use in route handlers
    req.license = license;
    next();
  } catch (error) {
    console.error('License verification failed:', error);
    return common.sendResponse(res, constant.requestMessages.INVALID_LICENSE, false, 500);
  }
};