const common = require('../../util/common');
const constant = require('../../util/constant');
const { RegulatoryBody, Country } = require('../../model');

// Get all regulatory bodies
exports.getAllRegulatoryBodies = async (req, res) => {
  try {
    const bodies = await RegulatoryBody.findAll({
      include: [{ model: Country, attributes: ['id', 'name', 'country_code'] }]
    });
    if (!bodies) {
      return common.sendResponse(res, constant.requestMessages.REGULATORY_BODY_NOT_FOUND, false, 404);
    }
    common.sendResponse(res, {
      success: true,
      regulatoryBodies: bodies,
    }, true, 200);
  } catch (error) {
    console.error('Error retrieving regulatory bodies:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_REGULATORY_BODIES, false, 500);
  }
};

// Get a single regulatory body by ID
exports.getRegulatoryBodyById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = await RegulatoryBody.findByPk(id, {
      include: [{ model: Country, attributes: ['id', 'name', 'country_code'] }]
    });
    if (!body) {
      return common.sendResponse(res, constant.requestMessages.REGULATORY_BODY_NOT_FOUND, false, 404);
    }
    common.sendResponse(res, {
      success: true,
      regulatoryBody: body,
    }, true, 200);
  } catch (error) {
    console.error('Error retrieving regulatory body:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_REGULATORY_BODY, false, 500);
  }
};

exports.createRegulatoryBody = async (req, res) => {
  try {
    const data = req.body;
    const newBody = await RegulatoryBody.create(data);
    const bodyWithCountry = await RegulatoryBody.findByPk(newBody.id, {
      include: [{ model: Country, attributes: ['id', 'name', 'country_code'] }]
    });
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.REGULATORY_BODY_CREATED.message,
      regulatoryBody: bodyWithCountry,
    }, true, 201);
  } catch (error) {
    console.error('Error creating regulatory body:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_REGULATORY_BODY, false, 500);
  }
};

exports.updateRegulatoryBody = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const body = await RegulatoryBody.findByPk(id);
    if (!body) {
      return common.sendResponse(res, constant.requestMessages.REGULATORY_BODY_NOT_FOUND, false, 404);
    }
    await body.update(data);
    const updatedBody = await RegulatoryBody.findByPk(id, {
      include: [{ model: Country, attributes: ['id', 'name', 'country_code'] }]
    });
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.REGULATORY_BODY_UPDATED.message,
      regulatoryBody: updatedBody,
    }, true, 200);
  } catch (error) {
    console.error('Error updating regulatory body:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_UPDATE_REGULATORY_BODY, false, 500);
  }
};

// Delete a regulatory body by ID
exports.deleteRegulatoryBody = async (req, res) => {
  try {
    const { id } = req.params;
    const body = await RegulatoryBody.findByPk(id);
    if (!body) {
      return common.sendResponse(res, constant.requestMessages.REGULATORY_BODY_NOT_FOUND, false, 404);
    }
    await body.destroy();
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.REGULATORY_BODY_DELETED.message,
    }, true, 200);
  } catch (error) {
    console.error('Error deleting regulatory body:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_DELETE_REGULATORY_BODY, false, 500);
  }
}; 