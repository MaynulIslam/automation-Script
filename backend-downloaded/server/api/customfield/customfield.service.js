const common = require('../../util/common');
const constant = require('../../util/constant');
const customFieldDAL = require('./customfield.helper');

// Get a single custom field by ID
exports.getCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    const customField = await customFieldDAL.getCustomField(id);

    if (!customField) {
      return common.sendResponse(res, constant.requestMessages.CUSTOM_FIELD_NOT_FOUND, false, 404);
    }

    common.sendResponse(res, {
      success: true,
      customField,
    }, true, 200);
  } catch (error) {
    console.error('Error retrieving custom field:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_CUSTOM_FIELD, false, 500);
  }
};

// Get all custom fields
exports.getAllCustomField = async (req, res) => {
  try {
    const { field_type } = req.query;
    const customFields = await customFieldDAL.getAllCustomField(field_type);
  
    if (!customFields) {
      return common.sendResponse(res, constant.requestMessages.CUSTOM_FIELDS_NOT_FOUND, false, 404);
    }

    common.sendResponse(res, {
      success: true,
      customFields,
    }, true, 200);
  } catch (error) {
    console.error('Error retrieving custom fields:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_CUSTOM_FIELDS, false, 500);
  }
};

// Insert a new custom field
exports.insertCustomField = async (req, res) => {
  try {
    const { field_type, field_name, field_value } = req.body;
    const newCustomField = await customFieldDAL.insertCustomField({ field_type, field_name, field_value });
    
    common.sendResponse(res, {
        success: true,
        message: constant.requestMessages.CUSTOM_FIELD_CREATED,
        customField: newCustomField,
    }, true, 201);
  } catch (error) {
    console.error('Error inserting custom field:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_CUSTOM_FIELD, false, 500);
  }
};

// Update a custom field by ID
exports.updateCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    const { field_type, field_name, field_value } = req.body;

    let customFieldValue = await customFieldDAL.getCustomField(id);
    let customField = customFieldValue.dataValues;
    if (!customField) {
      return common.sendResponse(res, constant.requestMessages.CUSTOM_FIELD_NOT_FOUND, false, 404);
    }
    // console.info('customField', customField);
    customField.field_type = field_type ? field_type : customField.field_type;
    customField.field_name = field_name ? field_name : customField.field_name;
    customField.field_value = field_value ? field_value : customField.field_value;
    // console.info( 'updated values---->',field_type, field_name, field_value);
    await customFieldDAL.updateCustomField(id, customField);

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.CUSTOM_FIELD_UPDATED,
      customField,
    }, true, 200);
  } catch (error) {
    console.error('Error updating custom field:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_UPDATE_CUSTOM_FIELD, false, 500);
  }
};

// Delete a custom field by ID
exports.deleteCustomField = async (req, res) => {
  try {
    const { id } = req.params;

    const customField = await customFieldDAL.getCustomField(id);

    if (!customField) {
      return common.sendResponse(res, constant.requestMessages.CUSTOM_FIELD_NOT_FOUND, false, 404);
    }

    await customFieldDAL.deleteCustomField(id);

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.CUSTOM_FIELD_DELETED,
    }, true, 200);
  } catch (error) {
    console.error('Error deleting custom field:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_DELETE_CUSTOM_FIELD, false, 500);
  }
};
