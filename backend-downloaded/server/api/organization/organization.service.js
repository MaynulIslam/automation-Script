const { insertUserOrganizationHandler } = require("../userorganization/userorganization.service");
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const organizationDAL = require("./organization.helper");

const common = require("../../util/common");
const constant = require("../../util/constant");
const { client } = require("../../util/common");

exports.getOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await organizationDAL.getOrganization(id);
    if (!organization) {
      return common.sendResponse(
        res,
        constant.requestMessages.ORGANIZATION_NOT_FOUND,
        false,
        404
      );
    }
    common.sendResponse(res, organization, true, 200);
  } catch (error) {
    console.error("Error retrieving organization:", error);
    common.sendResponse(
      res,
      constant.requestMessages.FAILED_TO_RETRIEVE_ORGANIZATION,
      false,
      500
    );
  }
};

exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await organizationDAL.getAllOrganizations();
   
    const values = { key: "organization", data: organizations };
    common.sendObjectResponse(res, values, true, 200);
  } catch (error) {
    console.error("Error retrieving organizations:", error);
    common.sendResponse(
      res,
      constant.requestMessages.FAILED_TO_RETRIEVE_ORGANIZATIONS,
      false,
      500
    );
  }
};

exports.selectOrganization = async (req, res) => {
  try {
    const {
      org_Id,
      dbConnectionString,
      userId
    } = req.body;
    
    common.sendResponse( res, dbConnectionString, true, 201, constant.requestMessages.ORGANIZATION_CREATED_SUCCESSFULLY );
  } catch (error) {
    console.error("Error inserting organization:", error);
    common.sendResponse(
      res,
      constant.requestMessages.FAILED_TO_INSERT_ORGANIZATION,
      false,
      500
    );
  }
}

exports.insertOrganization = async (req, res) => {
  try {
    const {
      org_name,
      org_location,
      org_unit,
      mobile,
      email,
      dbConnectionString,
      userId,
    } = req.body;

    // Get host info
    const host_info = common.retrieveHostInfo();
      
    // Generate organization UUID
    const org_id = uuidv4();
    
    // Combine org ID with host info to create a new combined host ID
    const combined_host_id = crypto
      .createHash('sha256')
      .update(`${org_id}-${host_info.machine_id}-${host_info.mac_address}-${host_info.cpu_info}`)
      .digest('hex');

    const { machine_id, mac_address, cpu_info } = common.retrieveHostInfo();
    console.info("combined_host_id", combined_host_id);
    client.publish("CREATE_ORG", JSON.stringify({progress: 25, updateText: 'Creating database...', isUpdating: true }));
    const newOrganization = await organizationDAL.insertOrganization({ id: org_id, org_name, org_location, org_unit, mobile, email, dbConnectionString, host_id: combined_host_id, machine_id, mac_address, cpu_id: cpu_info, status: 1});

    client.publish("CREATE_ORG", JSON.stringify({progress: 50, updateText: 'Creating database connection...', isUpdating: true }));
    
    client.publish("CREATE_ORG", JSON.stringify({progress: 75, updateText: 'Linking user and organization...', isUpdating: true }));
    console.info("userId", userId);
    console.info("organizationId", newOrganization.id);
    await insertUserOrganizationHandler({ userId: userId, organizationId: newOrganization.id });
    
    client.publish("CREATE_ORG", JSON.stringify({progress: 100, updateText: 'Finalizing details...', isUpdating: true }));
    common.sendResponse( res, newOrganization, true, 201, constant.requestMessages.ORGANIZATION_CREATED_SUCCESSFULLY );
  
  } catch (error) {
    console.error("Error inserting organization:", error);
    common.sendResponse(
      res,
      constant.requestMessages.FAILED_TO_INSERT_ORGANIZATION,
      false,
      500
    );
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    // Extract data from the request body
    const { id } = req.params;
    const { org_name, org_location, org_unit, mobile, email, status } =
      req.body;

    // Retrieve existing organization from the database
    let existingOrganization = await organizationDAL.getOrganization(id);
    existingOrganization = existingOrganization.get();
    // If organization is not found, return an error response
    if (!existingOrganization) {
      return common.sendResponse(
        res,
        constant.requestMessages.ORGANIZATION_NOT_FOUND,
        false,
        404
      );
    }

    // Update the organization details
    existingOrganization.org_name = org_name;
    existingOrganization.org_location = org_location;
    existingOrganization.org_unit = org_unit;
    existingOrganization.mobile = mobile;
    existingOrganization.email = email;
    existingOrganization.status = status;

    // Save the updated organization record to the database
    await organizationDAL.updateOrganization(
      existingOrganization.id,
      existingOrganization
    );

    common.sendResponse(
      res,
      {
        success: true,
        message: constant.requestMessages.ORGANIZATION_UPDATED_SUCCESSFULLY,
        organization: existingOrganization,
      },
      true,
      200
    );
  } catch (error) {
    console.error("Error updating organization:", error);
    common.sendResponse(
      res,
      constant.requestMessages.ERROR_ORGANIZATION_UPDATE,
      false,
      500
    );
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const existingOrganization = await organizationDAL.getOrganization(id);

    // If organization is not found, return an error response
    if (!existingOrganization) {
      return common.sendResponse(
        res,
        constant.requestMessages.ORGANIZATION_NOT_FOUND,
        false,
        404
      );
    }

    // Delete the organization from the database
    await organizationDAL.deleteOrganization(id);

    common.sendResponse(
      res,
      {
        success: true,
        message: constant.requestMessages.ORGANIZATION_DELETED_SUCCESSFULLY,
      },
      true,
      200
    );
  } catch (error) {
    console.error("Error deleting organization:", error);
    common.sendResponse(
      res,
      constant.requestMessages.ERROR_ORGANIZATION_DELETE,
      false,
      500
    );
  }
};

// mssql://muser:NBVgy789@localhost:49787/master
// postgresql://postgres:admin@localhost:5432/maestrolinkpoc
exports.testDbConnection = async (req, res) => {
  try {
    const { connectionString, databaseType } = req.body;
    const dbString = connectionString.split("://")[0];

    if (!constant.supportedDbList.includes(dbString)) {
      return common.sendResponse(
        res,
        constant.requestMessages.INVALID_DB_TYPE,
        false,
        400
      );
    }

    if (!constant.supportedDbList.includes(databaseType)) {
      return common.sendResponse(
        res,
        constant.requestMessages.INVALID_DB_TYPE,
        false,
        400
      );
    }

    if (dbString !== databaseType) {
      return common.sendResponse(
        res,
        constant.requestMessages.INVALID_DB_TYPE,
        false,
        400
      );
    }

    const sequelize = common.createSequelizeInstance(
      connectionString,
      databaseType
    );

    await sequelize.authenticate();
    await sequelize.close();

    return common.sendResponse(
      res,
      constant.requestMessages.SUCCESSFUL_CONNECTION,
      true,
      200
    );
  } catch (error) {
    console.log("Error testDbConnection");
    console.error(error);
    return common.sendResponse(
      res,
      constant.requestMessages.INVALID_CONNECTION,
      false,
      500
    );
  }
};
