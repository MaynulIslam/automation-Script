const common = require('../../util/common');
const constant = require('../../util/constant');
const userOrganizationDAL = require('./userorganization.helper');

exports.getUserOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const userOrganization = await userOrganizationDAL.getUserOrganization(id);
    if (!userOrganization) {
      return common.sendResponse(res, constant.requestMessages.USER_ORGANIZATION_NOT_FOUND, false, 404);
    }
    common.sendResponse(res, userOrganization, true, 200);
  } catch (error) {
    console.error('Error retrieving user organization:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_USER_ORGANIZATION, false, 500);
  }
};

exports.getAllUserOrganizations = async (req, res) => {
  try {
    const userOrganizations = await userOrganizationDAL.getAllUserOrganizations();
    if (!userOrganizations || userOrganizations.length === 0) {
      return common.sendResponse(res, constant.requestMessages.NO_USER_ORGANIZATIONS_FOUND, false, 404);
    }
    common.sendResponse(res, userOrganizations, true, 200);
  } catch (error) {
    console.error('Error retrieving user organizations:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_USER_ORGANIZATIONS, false, 500);
  }
};

exports.insertUserOrganization = async (req, res) => {
  try {

    const { status, userId,  organizationId} = req.body;
    const newUserOrganization = await userOrganizationDAL.insertUserOrganization({ status, UserId: userId, OrganizationId:organizationId });
    common.sendResponse(res, newUserOrganization, true, 201, constant.requestMessages.USER_ORGANIZATION_CREATED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error inserting user organization:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_USER_ORGANIZATION, false, 500);
  }
};

exports.insertUserOrganizationHandler = async(data) =>{
  try {
    const { userId,  organizationId} = data;
    return await userOrganizationDAL.insertUserOrganization({ status: 1, UserId: userId, OrganizationId: organizationId });
  } catch (error) {
    console.error('Error inserting user organization:', error);
    return false;
  }
}

exports.updateUserOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the userorganization in the database based on the provided ID
    const userOrganization = await userOrganizationDAL.getUserOrganization(id);

    if (!userOrganization) {
      common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_USER_ORGANIZATION, false, 500);
    }

    // Update the userorganization's details
    userOrganization.status = status;

    // Save the updated userorganization record to the database
    await userOrganizationDAL.updateUserOrganization(userOrganization);

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.USER_ORGANIZATION_UPDATED_SUCCESSFULLY,
      userOrganization,
    }, true, 200);
  } catch (error) {
    console.error('Error updating userorganization:', error);
    common.sendResponse(res, constant.requestMessages.ERROR_USER_ORGANIZATION_UPDATE, false, 500);
  }
};

exports.deleteUserOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the userorganization in the database based on the provided ID
    const userOrganization = await userOrganizationDAL.getUserOrganization(id);

    if (!userOrganization) {
      common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_USER_ORGANIZATION, false, 500);
    }

    // Delete the userorganization from the database
    await userOrganizationDAL.deleteUserOrganization(id);

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.USER_ORGANIZATION_DELETED_SUCCESSFULLY,
    }, true, 200);
  } catch (error) {
    console.error('Error deleting user organization:', error);
    common.sendResponse(res, constant.requestMessages.ERROR_USER_ORGANIZATION_DELETE, false, 500);
  }
};
