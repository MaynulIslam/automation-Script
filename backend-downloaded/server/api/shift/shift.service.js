const common = require('../../util/common');
const constant = require('../../util/constant');
const shiftDAL = require('./shift.helper');

exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await shiftDAL.getAllShifts();
    // Always return success with empty array if no shifts found
    common.sendResponse(res, {
      success: true,
      shifts: shifts || [],
    }, true, 200);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_SHIFTS, false, 500);
  }
};

exports.getShiftById = async (req, res) => {
  try {
    const shift = await shiftDAL.getShiftById(req.params.id);
    if (!shift) return common.sendResponse(res, constant.requestMessages.SHIFT_NOT_FOUND, false, 404);
    common.sendResponse(res, {
      success: true,
      shift,
    }, true, 200);
  } catch (error) {
    console.error('Error fetching shift:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_SHIFT, false, 500);
  }
};

exports.insertShift = async (req, res) => {
  try {
    // Check if we already have 3 shifts
    const existingShifts = await shiftDAL.getAllShifts();
    if (existingShifts && existingShifts.length >= 3) {
      return common.sendResponse(res, {
        success: false,
        message: 'Cannot create more than 3 shifts. The system must maintain exactly 3 shifts for 24-hour coverage.',
      }, false, 400);
    }
    
    const newShift = await shiftDAL.insertShift(req.body);
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.SHIFT_CREATED,
      shift: newShift,
    }, true, 201);
  } catch (error) {
    console.error('Error creating shift:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_CREATE_SHIFT, false, 500);
  }
};

exports.updateShift = async (req, res) => {
  try {
    const updated = await shiftDAL.updateShift(req.params.id, req.body);
    if (!updated) return common.sendResponse(res, constant.requestMessages.SHIFT_NOT_FOUND, false, 404);
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.SHIFT_UPDATED,
      shift: updated,
    }, true, 200);
  } catch (error) {
    console.error('Error updating shift:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_UPDATE_SHIFT, false, 500);
  }
};

exports.deleteShift = async (req, res) => {
  // Prevent deletion of shifts - always maintain exactly 3 shifts
  common.sendResponse(res, {
    success: false,
    message: 'Shift deletion is not allowed. The system must maintain exactly 3 shifts for 24-hour coverage.',
  }, false, 403);
}; 